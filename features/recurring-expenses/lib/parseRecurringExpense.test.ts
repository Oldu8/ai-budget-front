import {
  parseRecurringExpense,
  parseRecurringExpenseList,
} from './parseRecurringExpense';

function expense(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    category_id: 11,
    amount: 500,
    label: 'Gym',
    starts_at: '2026-01-01',
    frequency: 'monthly',
    interval: 1,
    ends_at: null,
    is_active: true,
    last_run_at: null,
    next_run_at: '2026-02-01',
    ...overrides,
  };
}

describe('parseRecurringExpense', () => {
  it('unwraps a Laravel { data } envelope', () => {
    const result = parseRecurringExpense({ data: expense() });
    expect(result.id).toBe(1);
  });

  it('accepts a raw (unwrapped) object', () => {
    const result = parseRecurringExpense(expense());
    expect(result.id).toBe(1);
  });

  it('throws when the id is missing', () => {
    expect(() => parseRecurringExpense({ data: expense({ id: undefined }) })).toThrow(
      'Invalid recurring expense response',
    );
  });

  it('throws when the id is null', () => {
    expect(() => parseRecurringExpense({ data: expense({ id: null }) })).toThrow(
      'Invalid recurring expense response',
    );
  });
});

describe('parseRecurringExpenseList', () => {
  it('unwraps a Laravel { data: [...] } envelope', () => {
    const result = parseRecurringExpenseList({ data: [expense(), expense({ id: 2 })] });
    expect(result).toHaveLength(2);
  });

  it('accepts a raw array', () => {
    const result = parseRecurringExpenseList([expense()]);
    expect(result).toHaveLength(1);
  });

  it('returns an empty array when the payload is not an array', () => {
    expect(parseRecurringExpenseList({ data: null })).toEqual([]);
    expect(parseRecurringExpenseList('nope')).toEqual([]);
  });
});
