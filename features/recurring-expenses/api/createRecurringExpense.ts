import { parseRecurringExpense } from '@/features/recurring-expenses/lib/parseRecurringExpense';
import type {
  CreateRecurringExpensePayload,
  RecurringExpense,
} from '@/features/recurring-expenses/types';
import { protectedPost } from '@/shared/api/protectedClient';

export async function createRecurringExpense(
  payload: CreateRecurringExpensePayload
): Promise<RecurringExpense> {
  const json = await protectedPost<unknown>(
    '/api/recurring-expenses',
    payload
  );
  return parseRecurringExpense(json);
}
