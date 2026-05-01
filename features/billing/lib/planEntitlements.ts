import { PlanType } from '@/entities/user';

/** Product-gated capabilities (extend as new paid surfaces are added). */
export type PaidFeature =
  | 'csvExport'
  | 'pastMonthNavigation'
  | 'recurringExpenses';

function normalizePlanType(plan: PlanType | string | undefined | null): PlanType {
  const raw = String(plan ?? PlanType.Free).toLowerCase();
  if (raw === PlanType.Basic) return PlanType.Basic;
  if (raw === PlanType.Plus) return PlanType.Plus;
  if (raw === PlanType.Premium) return PlanType.Premium;
  return PlanType.Free;
}

/** Whether the user's plan includes the given paid feature. */
export function planIncludesPaidFeature(
  plan: PlanType | string | undefined | null,
  feature: PaidFeature
): boolean {
  const p = normalizePlanType(plan);
  switch (feature) {
    case 'csvExport':
      return p !== PlanType.Free;
    case 'pastMonthNavigation':
      return p !== PlanType.Free;
    case 'recurringExpenses':
      return p === PlanType.Plus || p === PlanType.Premium;
    default:
      return false;
  }
}
