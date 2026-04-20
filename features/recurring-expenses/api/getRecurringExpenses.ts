import { parseRecurringExpenseList } from '@/features/recurring-expenses/lib/parseRecurringExpense';
import type { RecurringExpense } from '@/features/recurring-expenses/types';
import { protectedGet } from '@/shared/api/protectedClient';

export async function getRecurringExpenses(): Promise<RecurringExpense[]> {
  const json = await protectedGet<unknown>('/api/recurring-expenses');
  return parseRecurringExpenseList(json);
}
