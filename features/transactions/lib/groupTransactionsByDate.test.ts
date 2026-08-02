import type { TransactionListItem } from '@/features/transactions/types';

import { groupTransactionsByDate } from './groupTransactionsByDate';

function item(id: number, date: string): TransactionListItem {
  return { id, date, total_amount: 100, type: 'expense' };
}

const title = (dateKey: string) => `Title:${dateKey}`;

describe('groupTransactionsByDate', () => {
  it('returns an empty array for an empty input', () => {
    expect(groupTransactionsByDate([], title)).toEqual([]);
  });

  it('groups items sharing the same calendar day', () => {
    const result = groupTransactionsByDate(
      [
        item(1, '2026-03-10T08:00:00.000Z'),
        item(2, '2026-03-10T20:00:00.000Z'),
      ],
      title,
    );
    expect(result).toHaveLength(1);
    expect(result[0].dateKey).toBe('2026-03-10');
    expect(result[0].data.map((i) => i.id)).toEqual([1, 2]);
  });

  it('sorts sections by date descending (most recent first)', () => {
    const result = groupTransactionsByDate(
      [item(1, '2026-03-01'), item(2, '2026-03-15'), item(3, '2026-03-08')],
      title,
    );
    expect(result.map((s) => s.dateKey)).toEqual([
      '2026-03-15',
      '2026-03-08',
      '2026-03-01',
    ]);
  });

  it('uses formatSectionTitle to build each section title', () => {
    const result = groupTransactionsByDate([item(1, '2026-03-10')], title);
    expect(result[0].title).toBe('Title:2026-03-10');
  });

  it('skips rows with a missing or empty date', () => {
    const result = groupTransactionsByDate(
      [item(1, ''), { ...item(2, ''), date: undefined as unknown as string }],
      title,
    );
    expect(result).toEqual([]);
  });
});
