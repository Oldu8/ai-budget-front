import { parseRecurringExpense } from '@/features/recurring-expenses/lib/parseRecurringExpense';
import type {
  RecurringExpense,
  UpdateRecurringExpensePayload,
} from '@/features/recurring-expenses/types';
import { protectedPut } from '@/shared/api/protectedClient';

export async function updateRecurringExpense(
  id: number,
  payload: UpdateRecurringExpensePayload
): Promise<RecurringExpense> {
  const json = await protectedPut<unknown>(
    `/api/recurring-expenses/${id}`,
    payload
  );
  return parseRecurringExpense(json);
}
