import type { TransactionDetail } from '@/features/transactions/types';

import { mapTransactionDetailToScannedDraft } from './mapTransactionToScannedDraft';

function detail(overrides: Partial<TransactionDetail> = {}): TransactionDetail {
  return {
    id: 42,
    date: '2026-03-05',
    total_amount: 1234,
    type: 'expense',
    created_by: 'user',
    confirmed_at: null,
    img_path: '/receipts/42.jpg',
    original_currency: 'EUR',
    original_total_amount: 1000,
    exchange_rate: 1.2,
    rate_is_approximate: false,
    items: [
      {
        id: 1,
        label: 'Milk',
        amount: 250,
        category_id: 11,
        category: { id: 11, name: 'groceries_dairy', label: 'Dairy' },
      },
    ],
    ...overrides,
  };
}

describe('mapTransactionDetailToScannedDraft', () => {
  it('maps a transaction detail into the same shape as a scanned draft', () => {
    const result = mapTransactionDetailToScannedDraft(detail());
    expect(result).toEqual({
      id: 42,
      date: '2026-03-05',
      totalAmount: 1234,
      createdBy: 'user',
      confirmedAt: null,
      imgPath: '/receipts/42.jpg',
      rawAiData: undefined,
      originalCurrency: 'EUR',
      originalTotalAmount: 1000,
      exchangeRate: 1.2,
      rateIsApproximate: false,
      items: [
        {
          id: 1,
          label: 'Milk',
          amount: 250,
          categoryId: 11,
          categoryLabel: 'Dairy',
        },
      ],
    });
  });

  it('defaults an item label to an empty string when null', () => {
    const result = mapTransactionDetailToScannedDraft(
      detail({
        items: [{ id: 1, label: null, amount: 100 }],
      }),
    );
    expect(result.items[0].label).toBe('');
  });

  it('maps a null category to a null categoryLabel', () => {
    const result = mapTransactionDetailToScannedDraft(
      detail({
        items: [{ id: 1, label: 'Item', amount: 100, category: null }],
      }),
    );
    expect(result.items[0].categoryLabel).toBeNull();
  });
});
