import { startOfDay } from 'date-fns';

import type { RecurringExpense } from '@/features/recurring-expenses/types';

import {
  getDefaultRecurringExpenseFormValues,
  recurringExpenseSchema,
  recurringExpenseToFormData,
} from './recurringExpenseSchema';

function validData(overrides: Record<string, unknown> = {}) {
  return {
    amount: 10,
    subcategoryId: 11,
    startsAt: startOfDay(new Date(2026, 2, 1)),
    frequency: 'monthly' as const,
    endsAt: null,
    hasEndDate: false,
    label: null,
    ...overrides,
  };
}

describe('recurringExpenseSchema', () => {
  it('accepts a valid payload with no end date', () => {
    expect(recurringExpenseSchema.safeParse(validData()).success).toBe(true);
  });

  it('rejects an amount of 0', () => {
    expect(
      recurringExpenseSchema.safeParse(validData({ amount: 0 })).success,
    ).toBe(false);
  });

  it('rejects an amount above the maximum', () => {
    expect(
      recurringExpenseSchema.safeParse(validData({ amount: 1_000_001 })).success,
    ).toBe(false);
  });

  it('rejects a null subcategoryId', () => {
    expect(
      recurringExpenseSchema.safeParse(validData({ subcategoryId: null })).success,
    ).toBe(false);
  });

  it('rejects a non-positive subcategoryId', () => {
    expect(
      recurringExpenseSchema.safeParse(validData({ subcategoryId: 0 })).success,
    ).toBe(false);
  });

  it('rejects an invalid frequency', () => {
    expect(
      recurringExpenseSchema.safeParse(validData({ frequency: 'daily' })).success,
    ).toBe(false);
  });

  it('rejects hasEndDate true with a null endsAt', () => {
    const result = recurringExpenseSchema.safeParse(
      validData({ hasEndDate: true, endsAt: null }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects an endsAt before startsAt when hasEndDate is true', () => {
    const result = recurringExpenseSchema.safeParse(
      validData({
        hasEndDate: true,
        startsAt: startOfDay(new Date(2026, 2, 10)),
        endsAt: startOfDay(new Date(2026, 2, 1)),
      }),
    );
    expect(result.success).toBe(false);
  });

  it('accepts an endsAt on the same day as startsAt when hasEndDate is true', () => {
    const day = startOfDay(new Date(2026, 2, 10));
    const result = recurringExpenseSchema.safeParse(
      validData({ hasEndDate: true, startsAt: day, endsAt: day }),
    );
    expect(result.success).toBe(true);
  });

  it('accepts an endsAt after startsAt when hasEndDate is true', () => {
    const result = recurringExpenseSchema.safeParse(
      validData({
        hasEndDate: true,
        startsAt: startOfDay(new Date(2026, 2, 1)),
        endsAt: startOfDay(new Date(2026, 2, 10)),
      }),
    );
    expect(result.success).toBe(true);
  });

  it('ignores endsAt validation when hasEndDate is false, even if endsAt is before startsAt', () => {
    const result = recurringExpenseSchema.safeParse(
      validData({
        hasEndDate: false,
        startsAt: startOfDay(new Date(2026, 2, 10)),
        endsAt: startOfDay(new Date(2026, 2, 1)),
      }),
    );
    expect(result.success).toBe(true);
  });
});

describe('getDefaultRecurringExpenseFormValues', () => {
  it('returns sensible defaults for a new recurring expense', () => {
    const defaults = getDefaultRecurringExpenseFormValues();
    expect(defaults.amount).toBe(0);
    expect(defaults.subcategoryId).toBeNull();
    expect(defaults.frequency).toBe('monthly');
    expect(defaults.endsAt).toBeNull();
    expect(defaults.hasEndDate).toBe(false);
    expect(defaults.label).toBeNull();
    expect(defaults.startsAt.getTime()).toBe(startOfDay(new Date()).getTime());
  });
});

describe('recurringExpenseToFormData', () => {
  function expense(overrides: Partial<RecurringExpense> = {}): RecurringExpense {
    return {
      id: 1,
      category_id: 11,
      amount: 1050,
      label: 'Gym',
      starts_at: '2026-03-01',
      frequency: 'monthly',
      interval: 1,
      ends_at: null,
      is_active: true,
      last_run_at: null,
      next_run_at: null,
      ...overrides,
    };
  }

  it('converts minor units to major units', () => {
    const result = recurringExpenseToFormData(expense({ amount: 1050 }));
    expect(result.amount).toBe(10.5);
  });

  it('carries over category, frequency, and label', () => {
    const result = recurringExpenseToFormData(expense());
    expect(result.subcategoryId).toBe(11);
    expect(result.frequency).toBe('monthly');
    expect(result.label).toBe('Gym');
  });

  it('sets hasEndDate false and endsAt null when ends_at is null', () => {
    const result = recurringExpenseToFormData(expense({ ends_at: null }));
    expect(result.hasEndDate).toBe(false);
    expect(result.endsAt).toBeNull();
  });

  it('sets hasEndDate true and parses endsAt when ends_at is present', () => {
    const result = recurringExpenseToFormData(
      expense({ ends_at: '2026-06-01' }),
    );
    expect(result.hasEndDate).toBe(true);
    expect(result.endsAt?.getTime()).toBe(
      startOfDay(new Date('2026-06-01')).getTime(),
    );
  });

  it('falls back to today for an unparseable starts_at', () => {
    const before = startOfDay(new Date()).getTime();
    const result = recurringExpenseToFormData(
      expense({ starts_at: 'not-a-date' }),
    );
    expect(result.startsAt.getTime()).toBe(before);
  });
});
