import { protectedDelete } from '@/shared/api/protectedClient';

export async function deleteTransaction(transactionId: number): Promise<void> {
  return protectedDelete(`/api/transactions/${transactionId}`);
}
