import { protectedGet } from '@/shared/api/protectedClient';

import type {
  TransactionListItem,
  TransactionsListMeta,
  TransactionsListResult,
} from '@/features/transactions/types';

export type GetTransactionsParams = {
  from?: string;
  to?: string;
  type?: 'expense' | 'income';
  per_page?: number;
  page?: number;
};

const DEFAULT_META: TransactionsListMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
};

export async function getTransactions(
  params: GetTransactionsParams
): Promise<TransactionsListResult> {
  const search = new URLSearchParams();
  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  if (params.type) search.set('type', params.type);
  if (params.per_page != null) search.set('per_page', String(params.per_page));
  if (params.page != null) search.set('page', String(params.page));
  const qs = search.toString();
  const path = qs ? `/api/transactions?${qs}` : '/api/transactions';
  const response = await protectedGet<{
    data: TransactionListItem[];
    meta: TransactionsListMeta;
  }>(path);

  return {
    data: response.data ?? [],
    meta: response.meta ?? DEFAULT_META,
  };
}
