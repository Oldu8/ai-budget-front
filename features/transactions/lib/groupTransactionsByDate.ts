import type { TransactionListItem } from '@/features/transactions/types';

export type TransactionDateSection = {
  dateKey: string;
  title: string;
  data: TransactionListItem[];
};

/** Group by calendar date (YYYY-MM-DD). */
export function groupTransactionsByDate(
  items: TransactionListItem[],
  formatSectionTitle: (dateKey: string) => string
): TransactionDateSection[] {
  const map = new Map<string, TransactionListItem[]>();
  for (const row of items) {
    const key = row.date?.slice(0, 10) ?? '';
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }
  const keys = [...map.keys()].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return keys.map((dateKey) => ({
    dateKey,
    title: formatSectionTitle(dateKey),
    data: map.get(dateKey) ?? [],
  }));
}
