import { useMutation } from '@tanstack/react-query';

import { createPortalSession } from '@/features/billing/api/createPortalSession';
import type { BillingPlanType } from '@/features/billing/types';

export function usePortalMutation() {
  return useMutation({
    mutationFn: (planType?: BillingPlanType) => createPortalSession(planType),
  });
}
