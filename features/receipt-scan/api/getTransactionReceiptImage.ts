import { protectedGet } from '@/shared/api/protectedClient';

export type TransactionReceiptImageResponse = {
  url: string;
  expires_in: number;
};

export async function getTransactionReceiptImage(
  transactionId: number
): Promise<TransactionReceiptImageResponse> {
  return protectedGet<TransactionReceiptImageResponse>(
    `/api/transactions/${transactionId}/image`
  );
}
