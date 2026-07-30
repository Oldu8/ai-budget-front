import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PlanType } from '@/entities/user';
import { ApiError } from '@/shared/api/client';
import { useUserStore } from '@/features/auth/model/useUserStore';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useCheckoutMutation } from '@/features/billing/model/useCheckoutMutation';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { usePortalMutation } from '@/features/billing/model/usePortalMutation';
import { isRevenueCatPlatform, purchasePlan, RevenueCatCancelledError } from '@/features/billing/lib/revenueCat';
import type { BillingPlanType } from '@/features/billing/types';
import { Analytics } from '@/shared/analytics';
import { useToast } from '@/shared/ui/Toast/ToastContext';

/** Stripe webhooks land a few seconds after checkout/portal closes — poll /me until the plan flips. */
const PLAN_POLL_ATTEMPTS = 5;
const PLAN_POLL_INTERVAL_MS = 2000;

/** Apple's own subscription management screen — cancelling/managing an IAP-bought plan must go through here. */
const APPLE_MANAGE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

function currentPlanKey(): string {
  return String(useUserStore.getState().subscription?.plan?.type ?? PlanType.Free);
}

export function useBillingActions() {
  const { t } = useTranslation();
  const { refetchMe } = useAuthContext();
  const checkoutMutation = useCheckoutMutation();
  const portalMutation = usePortalMutation();
  const [checkoutLoadingPlanType, setCheckoutLoadingPlanType] =
    useState<BillingPlanType | null>(null);
  const [portalLoadingPlanType, setPortalLoadingPlanType] = useState<BillingPlanType | null>(
    null
  );
  const { showToast, hideToast } = useToast();
  const openPaywall = usePaywallStore((s) => s.open);
  const closePaywall = usePaywallStore((s) => s.close);

  /** Resolves true once the subscription plan differs from `prevKey`, false if it never changes. */
  const waitForPlanChange = useCallback(
    async (prevKey: string): Promise<boolean> => {
      for (let attempt = 0; attempt < PLAN_POLL_ATTEMPTS; attempt++) {
        await refetchMe();
        if (currentPlanKey() !== prevKey) {
          return true;
        }
        await new Promise((resolve) => setTimeout(resolve, PLAN_POLL_INTERVAL_MS));
      }
      return false;
    },
    [refetchMe]
  );

  /**
   * iOS purchases go through RevenueCat/StoreKit — Apple requires In-App Purchase for
   * digital subscriptions bought inside the app (guideline 3.1.1). Also used to switch
   * tiers on iOS: StoreKit prorates automatically within the subscription group.
   */
  const buyViaRevenueCat = useCallback(
    async (planType: BillingPlanType) => {
      setCheckoutLoadingPlanType(planType);
      Analytics.logBeginCheckout(planType);
      try {
        const prevPlanKey = currentPlanKey();
        await purchasePlan(planType);
        const planChanged = await waitForPlanChange(prevPlanKey);
        if (planChanged) {
          closePaywall();
          showToast({
            title: t('billing.checkoutSuccessTitle', 'Subscription activated 🎉'),
            text: t(
              'billing.checkoutSuccessMessage',
              'Thanks for your purchase — your new plan is ready.'
            ),
            type: 'success',
          });
        }
      } catch (err) {
        if (err instanceof RevenueCatCancelledError) {
          return;
        }
        showToast({
          title: t('billing.checkoutErrorTitle', 'Unable to start checkout'),
          text:
            err instanceof Error
              ? err.message
              : t('billing.checkoutErrorMessage', 'Please try again.'),
          type: 'error',
        });
        throw err;
      } finally {
        setCheckoutLoadingPlanType(null);
      }
    },
    [closePaywall, showToast, t, waitForPlanChange]
  );

  const startCheckout = useCallback(
    async (planType: BillingPlanType) => {
      if (planType === PlanType.Free) {
        return;
      }

      if (isRevenueCatPlatform()) {
        await buyViaRevenueCat(planType);
        return;
      }

      setCheckoutLoadingPlanType(planType);
      Analytics.logBeginCheckout(planType);
      showToast({
        title: t('billing.checkoutOpening', 'Opening checkout…'),
        type: 'loading',
      });
      try {
        const prevPlanKey = currentPlanKey();
        const { checkout_url } = await checkoutMutation.mutateAsync(planType);
        hideToast();
        await WebBrowser.openBrowserAsync(checkout_url);
        const planChanged = await waitForPlanChange(prevPlanKey);
        if (planChanged) {
          closePaywall();
          showToast({
            title: t('billing.checkoutSuccessTitle', 'Subscription activated 🎉'),
            text: t(
              'billing.checkoutSuccessMessage',
              'Thanks for your purchase — your new plan is ready.'
            ),
            type: 'success',
          });
        }
      } catch (err) {
        hideToast();
        showToast({
          title: t('billing.checkoutErrorTitle', 'Unable to start checkout'),
          text:
            err instanceof Error
              ? err.message
              : t('billing.checkoutErrorMessage', 'Please try again.'),
          type: 'error',
        });
        throw err;
      } finally {
        setCheckoutLoadingPlanType(null);
      }
    },
    [buyViaRevenueCat, checkoutMutation, closePaywall, hideToast, showToast, t, waitForPlanChange]
  );

  /** Optional `focusedPlan`: opens the portal directly on the "confirm plan change" screen
   * for that plan (and scopes row loading state to it in PaywallSheet). */
  const openPortal = useCallback(async (focusedPlan?: BillingPlanType) => {
    // Guard against being wired straight into onPress: a press event object here
    // would end up as the request body (and JSON.stringify chokes on its cycles).
    const targetPlan = typeof focusedPlan === 'string' ? focusedPlan : undefined;

    // iOS: switching tiers is just another purchase (StoreKit prorates automatically
    // within the group). Managing/cancelling an existing one must go through Apple's
    // own subscription settings — there's no custom UI allowed for that on iOS.
    if (isRevenueCatPlatform()) {
      if (targetPlan) {
        await buyViaRevenueCat(targetPlan);
        return;
      }
      await Linking.openURL(APPLE_MANAGE_SUBSCRIPTIONS_URL);
      return;
    }

    const trackRow = targetPlan !== undefined;
    if (targetPlan !== undefined) {
      setPortalLoadingPlanType(targetPlan);
    }
    showToast({
      title: t('billing.portalOpening', 'Opening billing portal…'),
      type: 'loading',
    });
    try {
      const prevPlanKey = currentPlanKey();
      const { portal_url } = await portalMutation.mutateAsync(targetPlan);
      hideToast();
      await WebBrowser.openBrowserAsync(portal_url);
      const planChanged = await waitForPlanChange(prevPlanKey);
      if (planChanged) {
        closePaywall();
        showToast({
          title: t('billing.planUpdatedTitle', 'Plan updated 🎉'),
          text: t(
            'billing.planUpdatedMessage',
            'Your subscription has been changed successfully.'
          ),
          type: 'success',
        });
      }
    } catch (err) {
      hideToast();
      showToast({
        title: t('billing.portalErrorTitle', 'Unable to open portal'),
        text:
          err instanceof Error
            ? err.message
            : t('billing.portalErrorMessage', 'Please try again.'),
        type: 'error',
      });
      if (err instanceof ApiError && err.status === 400) {
        openPaywall();
      }
      throw err;
    } finally {
      if (trackRow) {
        setPortalLoadingPlanType(null);
      }
    }
  }, [buyViaRevenueCat, closePaywall, hideToast, openPaywall, portalMutation, showToast, t, waitForPlanChange]);

  return {
    startCheckout,
    openPortal,
    openPaywall,
    closePaywall,
    checkoutLoadingPlanType,
    portalLoadingPlanType,
  };
}
