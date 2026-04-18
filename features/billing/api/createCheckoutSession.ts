import type { BillingPlanType, CheckoutResponse } from '@/features/billing/types';
import { protectedPost } from '@/shared/api/protectedClient';

export async function createCheckoutSession(
  planType: BillingPlanType
): Promise<CheckoutResponse> {
  return protectedPost<CheckoutResponse>('/api/stripe/checkout', {
    plan_type: planType,
  });
}
