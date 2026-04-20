import type { RecurringExpense } from '@/features/recurring-expenses/types';

/** Laravel `{ data: T }` envelope or raw `T`. */
function dataOf<T>(json: unknown): T {
  return ((json as { data?: T }).data ?? json) as T;
}

export function parseRecurringExpense(json: unknown): RecurringExpense {
  const row = dataOf<RecurringExpense>(json);
  if (row?.id == null) {
    throw new Error('Invalid recurring expense response');
  }
  return row;
}

export function parseRecurringExpenseList(json: unknown): RecurringExpense[] {
  const rows = dataOf<unknown>(json);
  return Array.isArray(rows) ? (rows as RecurringExpense[]) : [];
}
