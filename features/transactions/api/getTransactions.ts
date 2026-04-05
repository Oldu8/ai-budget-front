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

function num(v: unknown): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function parseListItem(raw: unknown): TransactionListItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = num(o.id);
  if (id === null) return null;
  return {
    id,
    date: str(o.date),
    total_amount: num(o.total_amount) ?? 0,
    type: str(o.type) || 'expense',
    created_by: o.created_by != null ? str(o.created_by) : undefined,
    img_path:
      o.img_path === null || o.img_path === undefined
        ? null
        : str(o.img_path),
    items: Array.isArray(o.items) ? (o.items as TransactionListItem['items']) : undefined,
  };
}

function parsePaginated(json: unknown): TransactionsListResult {
  if (!json || typeof json !== 'object') {
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    };
  }
  const root = json as Record<string, unknown>;
  const rawList = Array.isArray(root.data) ? root.data : [];
  const data: TransactionListItem[] = [];
  for (const row of rawList) {
    const item = parseListItem(row);
    if (item) data.push(item);
  }

  const metaObj =
    root.meta && typeof root.meta === 'object'
      ? (root.meta as Record<string, unknown>)
      : null;

  const meta: TransactionsListMeta = {
    current_page: num(metaObj?.current_page) ?? 1,
    last_page: num(metaObj?.last_page) ?? 1,
    per_page: num(metaObj?.per_page) ?? 20,
    total: num(metaObj?.total) ?? data.length,
  };

  return { data, meta };
}

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
  const json = await protectedGet<unknown>(path);
  return parsePaginated(json);
}
