import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { PlanType } from '@/entities/user';
import { ApiError } from '@/shared/api/client';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useCheckoutMutation } from '@/features/billing/model/useCheckoutMutation';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { usePortalMutation } from '@/features/billing/model/usePortalMutation';
import type { BillingPlanType } from '@/features/billing/types';
import { useToast } from '@/shared/ui/Toast/ToastContext';

export function useBillingActions() {
  const { t } = useTranslation();
  const { refetchMe } = useAuthContext();
  const checkoutMutation = useCheckoutMutation();
  const portalMutation = usePortalMutation();
  const { showToast, hideToast } = useToast();
  const openPaywall = usePaywallStore((s) => s.open);
  const closePaywall = usePaywallStore((s) => s.close);

  const startCheckout = useCallback(
    async (planType: BillingPlanType) => {
      if (planType === PlanType.Free) {
        return;
      }
      showToast({
        title: t('billing.checkoutOpening', 'Opening checkout…'),
        type: 'loading',
      });
      try {
        const { checkout_url } = await checkoutMutation.mutateAsync(planType);
        hideToast();
        await WebBrowser.openBrowserAsync(checkout_url);
        await refetchMe();
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
      }
    },
    [checkoutMutation, hideToast, refetchMe, showToast, t]
  );

  const openPortal = useCallback(async () => {
    showToast({
      title: t('billing.portalOpening', 'Opening billing portal…'),
      type: 'loading',
    });
    try {
      const { portal_url } = await portalMutation.mutateAsync();
      hideToast();
      await WebBrowser.openBrowserAsync(portal_url);
      await refetchMe();
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
    }
  }, [hideToast, openPaywall, portalMutation, refetchMe, showToast, t]);

  return {
    startCheckout,
    openPortal,
    openPaywall,
    closePaywall,
    checkoutStatus: checkoutMutation.status,
    portalStatus: portalMutation.status,
  };
}
