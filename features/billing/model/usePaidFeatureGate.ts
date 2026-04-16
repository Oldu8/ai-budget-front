import { useCallback } from 'react';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import {
  type OpenPaywallParams,
  usePaywallStore,
} from '@/features/billing/model/usePaywallStore';
import {
  planIncludesPaidFeature,
  type PaidFeature,
} from '@/features/billing/lib/planEntitlements';

type PaywallCopy = Pick<OpenPaywallParams, 'title' | 'reasonText'>;

/**
 * Before navigating to a paid-only screen, call `requestAccess`:
 * runs `onGranted` if the plan includes the feature; otherwise opens the paywall with the given copy.
 */
export function usePaidFeatureGate() {
  const { subscription } = useAuthContext();
  const openPaywall = usePaywallStore((s) => s.open);
  const planType = subscription?.plan?.type ?? PlanType.Free;

  const requestAccess = useCallback(
    (feature: PaidFeature, onGranted: () => void, paywall: PaywallCopy) => {
      if (planIncludesPaidFeature(planType, feature)) {
        onGranted();
      } else {
        openPaywall({
          title: paywall.title,
          reasonText: paywall.reasonText,
        });
      }
    },
    [planType, openPaywall]
  );

  return { requestAccess, planType };
}
