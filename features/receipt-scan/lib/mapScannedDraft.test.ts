import { mapScannedDraft } from './mapScannedDraft';

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      id: 42,
      date: '2026-03-05',
      total_amount: 1234,
      created_by: 'ai',
      confirmed_at: null,
      img_path: '/receipts/42.jpg',
      raw_ai_data: { source: 'receipt' },
      original_currency: 'EUR',
      original_total_amount: 1000,
      exchange_rate: 1.234,
      rate_is_approximate: true,
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
    },
  };
}

describe('mapScannedDraft', () => {
  it('maps a full valid payload', () => {
    const result = mapScannedDraft(validPayload());
    expect(result).toEqual({
      id: 42,
      date: '2026-03-05',
      totalAmount: 1234,
      createdBy: 'ai',
      confirmedAt: null,
      imgPath: '/receipts/42.jpg',
      rawAiData: { source: 'receipt' },
      originalCurrency: 'EUR',
      originalTotalAmount: 1000,
      exchangeRate: 1.234,
      rateIsApproximate: true,
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

  it('throws for a non-object payload', () => {
    expect(() => mapScannedDraft(null)).toThrow('Invalid scan response');
    expect(() => mapScannedDraft('nope')).toThrow('Invalid scan response');
  });

  it('throws when data is missing', () => {
    expect(() => mapScannedDraft({})).toThrow(
      'Invalid scan response: missing data',
    );
  });

  it('throws when the transaction id is missing or invalid', () => {
    expect(() => mapScannedDraft(validPayload({ id: undefined }))).toThrow(
      'Invalid scan response: missing transaction id',
    );
    expect(() => mapScannedDraft(validPayload({ id: 'abc' }))).toThrow(
      'Invalid scan response: missing transaction id',
    );
  });

  it('defaults totalAmount to 0 when missing or invalid', () => {
    const result = mapScannedDraft(validPayload({ total_amount: 'not-a-number' }));
    expect(result.totalAmount).toBe(0);
  });

  it('falls back to an empty items array when items is missing or not an array', () => {
    expect(mapScannedDraft(validPayload({ items: undefined })).items).toEqual(
      [],
    );
    expect(mapScannedDraft(validPayload({ items: 'nope' })).items).toEqual([]);
  });

  it('drops item rows without a valid numeric id', () => {
    const result = mapScannedDraft(
      validPayload({
        items: [
          { id: 1, label: 'Kept', amount: 100 },
          { label: 'Dropped, no id', amount: 200 },
        ],
      }),
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0].label).toBe('Kept');
  });

  it('falls back to category_id when the nested category id is absent', () => {
    const result = mapScannedDraft(
      validPayload({
        items: [{ id: 1, label: 'Item', amount: 100, category_id: 7, category: null }],
      }),
    );
    expect(result.items[0].categoryId).toBe(7);
    expect(result.items[0].categoryLabel).toBeNull();
  });

  it('prefers category.label over category.name for categoryLabel', () => {
    const result = mapScannedDraft(
      validPayload({
        items: [
          {
            id: 1,
            label: 'Item',
            amount: 100,
            category: { id: 5, name: 'groceries_meat', label: 'Meat' },
          },
        ],
      }),
    );
    expect(result.items[0].categoryLabel).toBe('Meat');
  });

  it('falls back to category.name when category.label is empty', () => {
    const result = mapScannedDraft(
      validPayload({
        items: [
          {
            id: 1,
            label: 'Item',
            amount: 100,
            category: { id: 5, name: 'groceries_meat', label: '' },
          },
        ],
      }),
    );
    expect(result.items[0].categoryLabel).toBe('groceries_meat');
  });

  it('normalizes the date to a YYYY-MM-DD key', () => {
    const result = mapScannedDraft(
      validPayload({ date: '2026-03-05T10:00:00.000Z' }),
    );
    expect(result.date).toBe('2026-03-05');
  });
});
