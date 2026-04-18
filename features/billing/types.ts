import type { PlanType } from '@/entities/user';

export type BillingPlanType = PlanType | string;

export interface BillingPlan {
  type: BillingPlanType;
  label: string;
  price: number;
  currency: string | null;
  price_id: string | null;
  check_limit: number;
  description: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalResponse {
  portal_url: string;
}
