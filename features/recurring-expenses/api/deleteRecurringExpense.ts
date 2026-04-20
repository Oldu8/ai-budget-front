import { protectedDelete } from '@/shared/api/protectedClient';

export async function deleteRecurringExpense(id: number): Promise<void> {
  return protectedDelete(`/api/recurring-expenses/${id}`);
}
