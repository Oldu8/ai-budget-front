import { useMutation } from '@tanstack/react-query';

import { createCheckoutSession } from '@/features/billing/api/createCheckoutSession';
import type { BillingPlanType } from '@/features/billing/types';

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: (planType: BillingPlanType) => createCheckoutSession(planType),
  });
}
