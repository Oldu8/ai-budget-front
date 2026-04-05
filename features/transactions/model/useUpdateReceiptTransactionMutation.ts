import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  type UpdateReceiptPayload,
  updateReceiptTransaction,
} from '@/features/receipt-scan/api/updateReceiptTransaction';

export function useUpdateReceiptTransactionMutation(transactionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateReceiptPayload) =>
      updateReceiptTransaction(transactionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}
