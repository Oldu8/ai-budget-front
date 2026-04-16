import { PlanType } from '@/entities/user';
import type { BillingPlan } from '@/features/billing/types';
import { protectedGet } from '@/shared/api/protectedClient';

/** Fixed display order: Free → Basic → Plus → Premium */
const PLAN_ORDER = ['free', 'basic', 'plus', 'premium'];

function planRank(type: string): number {
  const i = PLAN_ORDER.indexOf(type.toLowerCase());
  return i === -1 ? PLAN_ORDER.length : i;
}

function normalizePlan(raw: BillingPlan): BillingPlan {
  const type =
    raw?.type && typeof raw.type === 'string'
      ? (raw.type.toLowerCase() as BillingPlan['type'])
      : PlanType.Free;

  return {
    type,
    label: raw?.label?.trim() || type,
    price: typeof raw?.price === 'number' ? raw.price : 0,
    currency: raw?.currency ?? null,
    price_id: raw?.price_id ?? null,
    check_limit: typeof raw?.check_limit === 'number' ? raw.check_limit : 0,
    description: raw?.description ?? '',
  };
}

export async function getPlans(): Promise<BillingPlan[]> {
  const data = await protectedGet<BillingPlan[]>('/api/plans');
  return [...data.map(normalizePlan)].sort(
    (a, b) => planRank(String(a.type)) - planRank(String(b.type))
  );
}
