import { PlanType } from '@/entities/user';
import type { BillingPlanType, PortalResponse } from '@/features/billing/types';
import { protectedPost } from '@/shared/api/protectedClient';

/** Pass `planType` to open the portal directly on the "confirm plan change" screen for that plan. */
export async function createPortalSession(planType?: BillingPlanType): Promise<PortalResponse> {
  const body =
    planType && planType !== PlanType.Free ? { plan_type: planType } : undefined;
  return protectedPost<PortalResponse>('/api/stripe/portal', body);
}
