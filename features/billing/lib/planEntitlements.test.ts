import { PlanType } from '@/entities/user';

import { planIncludesPaidFeature } from './planEntitlements';

describe('planIncludesPaidFeature', () => {
  it('denies every paid feature on the Free plan', () => {
    expect(planIncludesPaidFeature(PlanType.Free, 'csvExport')).toBe(false);
    expect(planIncludesPaidFeature(PlanType.Free, 'pastMonthNavigation')).toBe(
      false,
    );
    expect(planIncludesPaidFeature(PlanType.Free, 'recurringExpenses')).toBe(
      false,
    );
    expect(planIncludesPaidFeature(PlanType.Free, 'analyticsDashboard')).toBe(
      false,
    );
    expect(planIncludesPaidFeature(PlanType.Free, 'voiceExpense')).toBe(false);
  });

  it('grants csvExport and pastMonthNavigation on any paid plan', () => {
    expect(planIncludesPaidFeature(PlanType.Basic, 'csvExport')).toBe(true);
    expect(planIncludesPaidFeature(PlanType.Basic, 'pastMonthNavigation')).toBe(
      true,
    );
  });

  it('gates recurringExpenses and analyticsDashboard behind Plus and above', () => {
    expect(planIncludesPaidFeature(PlanType.Basic, 'recurringExpenses')).toBe(
      false,
    );
    expect(planIncludesPaidFeature(PlanType.Plus, 'recurringExpenses')).toBe(
      true,
    );
    expect(planIncludesPaidFeature(PlanType.Premium, 'analyticsDashboard')).toBe(
      true,
    );
  });

  it('gates voiceExpense behind Premium only', () => {
    expect(planIncludesPaidFeature(PlanType.Plus, 'voiceExpense')).toBe(false);
    expect(planIncludesPaidFeature(PlanType.Premium, 'voiceExpense')).toBe(
      true,
    );
  });

  it('treats an undefined, null, or unrecognized plan as Free', () => {
    expect(planIncludesPaidFeature(undefined, 'csvExport')).toBe(false);
    expect(planIncludesPaidFeature(null, 'csvExport')).toBe(false);
    expect(planIncludesPaidFeature('not-a-plan', 'csvExport')).toBe(false);
  });

  it('normalizes plan value case', () => {
    expect(planIncludesPaidFeature('PREMIUM', 'voiceExpense')).toBe(true);
  });
});
