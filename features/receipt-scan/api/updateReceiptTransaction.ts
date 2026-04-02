import { z } from 'zod';

import { protectedPut } from '@/shared/api/protectedClient';

const receiptItemPayloadSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1),
  amount: z.number().int(),
  category_id: z.number().int().positive(),
});

export const updateReceiptPayloadSchema = z.object({
  date: z.string().min(1),
  items: z.array(receiptItemPayloadSchema).min(1),
});

export type UpdateReceiptPayload = z.infer<typeof updateReceiptPayloadSchema>;

export async function updateReceiptTransaction(
  transactionId: number,
  payload: UpdateReceiptPayload
): Promise<unknown> {
  const parsed = updateReceiptPayloadSchema.parse(payload);
  return protectedPut(`/api/transactions/${transactionId}/update`, parsed);
}
