import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { getTransactions } from '@/features/transactions/api/getTransactions';

export function useTransactionsListQuery(
  year: number,
  month: number,
  page: number,
  perPage = 20
) {
  const date = new Date(year, month - 1, 1);
  const from = format(startOfMonth(date), 'yyyy-MM-dd');
  const to = format(endOfMonth(date), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['transactions', 'list', { from, to, page, perPage }],
    queryFn: () =>
      getTransactions({
        from,
        to,
        type: 'expense',
        per_page: perPage,
        page,
      }),
    placeholderData: keepPreviousData,
  });
}
