import { protectedPost } from '@/shared/api/protectedClient';

export interface CreateTransactionPayload {
  total_amount: number;
  date: string;
  type: 'expense';
  category_id: number;
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<unknown> {
  return protectedPost('/api/transactions', payload);
}
