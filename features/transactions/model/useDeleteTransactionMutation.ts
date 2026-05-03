import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTransaction } from '@/features/transactions/api/deleteTransaction';

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: number) => deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}
