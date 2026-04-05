import { useQuery } from '@tanstack/react-query';

import { getTransaction } from '@/features/transactions/api/getTransaction';

export function useTransactionQuery(transactionId: number | null) {
  return useQuery({
    queryKey: ['transactions', 'detail', transactionId],
    queryFn: () => getTransaction(transactionId!),
    enabled: transactionId != null && transactionId > 0,
  });
}
