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

function findPackage(packages: PurchasesPackage[], identifier: string): PurchasesPackage | undefined {
  return packages.find((p) => p.identifier === identifier);
}

/**
 * Buys the package mapped to `planType` from the current Offering.
 * Resolves once Apple confirms the purchase — backend plan sync happens via the
 * RevenueCat webhook, same as the Stripe flow polls `/me` after checkout.
 */
export async function purchasePlan(planType: BillingPlanType): Promise<void> {
  const packageId = PACKAGE_IDS[planType as PlanType];
  if (!packageId) {
    throw new Error(`No RevenueCat package mapped for plan "${planType}"`);
  }

  const offerings = await Purchases.getOfferings();
  const pkg = offerings.current ? findPackage(offerings.current.availablePackages, packageId) : undefined;
  if (!pkg) {
    throw new Error(`Package "${packageId}" not found in the current RevenueCat offering`);
  }

  try {
    await Purchases.purchasePackage(pkg);
  } catch (err) {
    if ((err as PurchasesError)?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      throw new RevenueCatCancelledError();
    }
    throw err;
  }
}
