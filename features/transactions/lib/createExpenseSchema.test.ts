import { startOfDay } from 'date-fns';

import {
  createExpenseSchema,
  getDefaultExpenseFormValues,
} from './createExpenseSchema';

function validData(overrides: Record<string, unknown> = {}) {
  return {
    amount: 10,
    label: null,
    subcategoryId: 11,
    date: startOfDay(new Date('2026-03-10')),
    ...overrides,
  };
}

describe('createExpenseSchema', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-10T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('accepts a valid payload', () => {
    expect(createExpenseSchema.safeParse(validData()).success).toBe(true);
  });

  it('rejects an amount of 0', () => {
    expect(
      createExpenseSchema.safeParse(validData({ amount: 0 })).success,
    ).toBe(false);
  });

  it('rejects an amount above the maximum', () => {
    expect(
      createExpenseSchema.safeParse(validData({ amount: 1_000_001 })).success,
    ).toBe(false);
  });

  it('rejects a null subcategoryId', () => {
    expect(
      createExpenseSchema.safeParse(validData({ subcategoryId: null })).success,
    ).toBe(false);
  });

  it('rejects a non-positive subcategoryId', () => {
    expect(
      createExpenseSchema.safeParse(validData({ subcategoryId: 0 })).success,
    ).toBe(false);
  });

  it('accepts today as the date', () => {
    expect(
      createExpenseSchema.safeParse(
        validData({ date: startOfDay(new Date('2026-03-10')) }),
      ).success,
    ).toBe(true);
  });

  it('rejects a date in the future', () => {
    const result = createExpenseSchema.safeParse(
      validData({ date: startOfDay(new Date('2026-03-11')) }),
    );
    expect(result.success).toBe(false);
  });

  it('accepts a date in the past', () => {
    expect(
      createExpenseSchema.safeParse(
        validData({ date: startOfDay(new Date('2026-01-01')) }),
      ).success,
    ).toBe(true);
  });
});

describe('getDefaultExpenseFormValues', () => {
  it('defaults to zero amount, no subcategory, and today', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-10T12:00:00.000Z'));
    const defaults = getDefaultExpenseFormValues();
    expect(defaults.amount).toBe(0);
    expect(defaults.label).toBeNull();
    expect(defaults.subcategoryId).toBeNull();
    expect(defaults.date.getTime()).toBe(
      startOfDay(new Date('2026-03-10T12:00:00.000Z')).getTime(),
    );
    jest.useRealTimers();
  });
});
