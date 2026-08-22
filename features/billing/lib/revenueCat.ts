import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  type PurchasesError,
  type PurchasesPackage,
} from 'react-native-purchases';

import { PlanType } from '@/entities/user';
import { env } from '@/shared/constants/env';
import type { BillingPlanType } from '@/features/billing/types';

/** RevenueCat package identifiers configured in the `default` offering (App Store Connect → Subscriptions). */
const PACKAGE_IDS: Partial<Record<PlanType, string>> = {
  [PlanType.Basic]: 'basic_monthly',
  [PlanType.Plus]: 'plus_monthly',
  [PlanType.Premium]: 'premium_monthly',
};

let isConfigured = false;

/**
 * Apple requires In-App Purchase for digital subscriptions bought on iOS — Stripe stays
 * web/Android-only. Excludes Expo Go: react-native-purchases falls back to a JS-only shim
 * there that rejects any key without a `test_`/`rcb_` prefix, so a real iOS key would throw.
 * Falls back to the Stripe flow instead — real purchase testing needs a dev-client/production build.
 */
export function isRevenueCatPlatform(): boolean {
  return (
    Platform.OS === 'ios' &&
    env.revenueCatIosKey !== '' &&
    Constants.executionEnvironment !== ExecutionEnvironment.StoreClient
  );
}

/** Call once the authenticated user's id is known (e.g. from AuthProvider). No-op off iOS. */
export function configureRevenueCat(appUserId: string): void {
  if (!isRevenueCatPlatform()) return;

  if (!isConfigured) {
    Purchases.configure({ apiKey: env.revenueCatIosKey, appUserID: appUserId });
    isConfigured = true;
  } else {
    void Purchases.logIn(appUserId);
  }
}

/** Call on sign-out so a different account on the same device doesn't inherit cached entitlements. */
export function logOutRevenueCat(): void {
  if (!isConfigured) return;
  void Purchases.logOut();
}

export class RevenueCatCancelledError extends Error {}

/** StoreKit refused the purchase because this Apple ID already holds it (stale local subscription state). */
export class RevenueCatAlreadyOwnedError extends Error {}

function findPackage(packages: PurchasesPackage[], identifier: string): PurchasesPackage | undefined {
  return packages.find((p) => p.identifier === identifier);
}

async function getCurrentPackages(): Promise<PurchasesPackage[]> {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages ?? [];
}

/**
 * Buys the package mapped to `planType` from the current Offering. A purchase that resolves
 * without throwing is treated as success — checking `customerInfo.entitlements.active`
 * synchronously off the purchase result turned out to be racy (RevenueCat doesn't always have
 * it updated in that exact response yet), so we trust the resolved promise itself instead. The
 * webhook still persists the plan in our DB in the background, decoupled from this call.
 */
export async function purchasePlan(planType: BillingPlanType): Promise<void> {
  const packageId = PACKAGE_IDS[planType as PlanType];
  if (!packageId) {
    throw new Error(`No RevenueCat package mapped for plan "${planType}"`);
  }

  const pkg = findPackage(await getCurrentPackages(), packageId);
  if (!pkg) {
    throw new Error(`Package "${packageId}" not found in the current RevenueCat offering`);
  }

  try {
    await Purchases.purchasePackage(pkg);
  } catch (err) {
    const code = (err as PurchasesError)?.code;
    if (code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      throw new RevenueCatCancelledError();
    }
    if (code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      throw new RevenueCatAlreadyOwnedError();
    }
    throw err;
  }
}

/**
 * Re-syncs past purchases from Apple onto this account (Apple requires a visible "Restore
 * Purchases" action for any app selling restorable IAP — e.g. after a reinstall, or a second
 * device signed into the same Apple ID). Resolves `true` if anything was found and restored.
 */
export async function restorePurchases(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return Object.keys(customerInfo.entitlements.active).length > 0;
}

/**
 * Apple's own localized price string per plan (e.g. "$9.99"), read straight off the
 * StoreKit product. The backend's price/currency is Stripe-oriented (fixed EUR) and can
 * mismatch what Apple actually charges a given buyer, whose price depends on their App
 * Store storefront country — this is the source of truth for what iOS users actually pay.
 */
export async function getIosPriceStrings(): Promise<Partial<Record<PlanType, string>>> {
  const packages = await getCurrentPackages();
  const result: Partial<Record<PlanType, string>> = {};

  for (const planType of Object.keys(PACKAGE_IDS) as PlanType[]) {
    const packageId = PACKAGE_IDS[planType];
    const pkg = packageId ? findPackage(packages, packageId) : undefined;
    if (pkg) {
      result[planType] = pkg.product.priceString;
    }
  }

  return result;
}
