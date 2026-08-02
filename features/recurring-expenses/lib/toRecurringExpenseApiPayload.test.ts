import type { RecurringExpenseFormData } from './recurringExpenseSchema';
import {
  toCreateRecurringExpensePayload,
  toUpdateRecurringExpensePayload,
} from './toRecurringExpenseApiPayload';

function formData(overrides: Partial<RecurringExpenseFormData> = {}): RecurringExpenseFormData {
  return {
    amount: 10.5,
    subcategoryId: 11,
    startsAt: new Date(2026, 2, 1),
    frequency: 'monthly',
    endsAt: null,
    hasEndDate: false,
    label: null,
    ...overrides,
  };
}

describe('toCreateRecurringExpensePayload', () => {
  it('maps subcategoryId to category_id and amount to minor units', () => {
    const result = toCreateRecurringExpensePayload(formData());
    expect(result.category_id).toBe(11);
    expect(result.amount).toBe(1050);
  });

  it('throws when subcategoryId is null or non-positive', () => {
    expect(() =>
      toCreateRecurringExpensePayload(formData({ subcategoryId: null })),
    ).toThrow('Subcategory is required');
    expect(() =>
      toCreateRecurringExpensePayload(formData({ subcategoryId: 0 })),
    ).toThrow('Subcategory is required');
  });

  it('formats starts_at as YYYY-MM-DD', () => {
    const result = toCreateRecurringExpensePayload(
      formData({ startsAt: new Date(2026, 2, 5) }),
    );
    expect(result.starts_at).toBe('2026-03-05');
  });

  it('trims the label and nulls it out when blank', () => {
    expect(toCreateRecurringExpensePayload(formData({ label: '  Gym  ' })).label).toBe(
      'Gym',
    );
    expect(toCreateRecurringExpensePayload(formData({ label: '   ' })).label).toBeNull();
    expect(toCreateRecurringExpensePayload(formData({ label: null })).label).toBeNull();
  });

  it('sets ends_at when hasEndDate is true and endsAt is set', () => {
    const result = toCreateRecurringExpensePayload(
      formData({ hasEndDate: true, endsAt: new Date(2026, 5, 1) }),
    );
    expect(result.ends_at).toBe('2026-06-01');
  });

  it('nulls ends_at when hasEndDate is false, even if endsAt is set', () => {
    const result = toCreateRecurringExpensePayload(
      formData({ hasEndDate: false, endsAt: new Date(2026, 5, 1) }),
    );
    expect(result.ends_at).toBeNull();
  });

  it('nulls ends_at when hasEndDate is true but endsAt is null', () => {
    const result = toCreateRecurringExpensePayload(
      formData({ hasEndDate: true, endsAt: null }),
    );
    expect(result.ends_at).toBeNull();
  });

  it('always sends interval as 1', () => {
    expect(toCreateRecurringExpensePayload(formData()).interval).toBe(1);
  });
});

describe('toUpdateRecurringExpensePayload', () => {
  it('produces the same shape as the create payload', () => {
    const data = formData({ label: 'Gym' });
    expect(toUpdateRecurringExpensePayload(data)).toEqual(
      toCreateRecurringExpensePayload(data),
    );
  });
});
