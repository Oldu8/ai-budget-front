import type { TransactionDetail } from "@/features/transactions/types";
import { protectedGet } from "@/shared/api/protectedClient";

export async function getTransaction(
  transactionId: number,
): Promise<TransactionDetail> {
  const response = await protectedGet<{ data: TransactionDetail }>(
    `/api/transactions/${transactionId}`,
  );

  if (!response?.data) {
    throw new Error("Invalid transaction response");
  }

  return response.data;
}
