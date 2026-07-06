import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

import { usePaywallStore } from '@/features/billing/model/usePaywallStore';

/**
 * Handles the "Return to app" deep link from Stripe result pages
 * (vtrata://billing?status=success|updated|portal|cancel): dismisses the
 * in-app browser and, unless the user canceled, closes the paywall.
 * Success toasts come from the plan-change polling in useBillingActions,
 * which resumes as soon as the browser is dismissed.
 */
export function BillingReturnListener() {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url);
      const isBillingReturn =
        parsed.hostname === 'billing' ||
        parsed.path === 'billing' ||
        parsed.path?.startsWith('billing');
      if (!isBillingReturn) return;

      WebBrowser.dismissBrowser().catch(() => {
        /* No browser open (e.g. cold start) — nothing to dismiss. */
      });

      const status = parsed.queryParams?.status;
      if (status !== 'cancel') {
        usePaywallStore.getState().close();
      }
    });
    return () => subscription.remove();
  }, []);

  return null;
}
