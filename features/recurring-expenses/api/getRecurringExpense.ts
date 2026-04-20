import { parseRecurringExpense } from '@/features/recurring-expenses/lib/parseRecurringExpense';
import type { RecurringExpense } from '@/features/recurring-expenses/types';
import { protectedGet } from '@/shared/api/protectedClient';

export async function getRecurringExpense(
  id: number
): Promise<RecurringExpense> {
  const json = await protectedGet<unknown>(`/api/recurring-expenses/${id}`);
  return parseRecurringExpense(json);
}
