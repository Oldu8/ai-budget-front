import type { ScannedDraft } from './types';
import {
  isReceiptReviewDirty,
  sumReviewItemsMinor,
  useReceiptReviewStore,
} from './useReceiptReviewStore';

function resetStore() {
  useReceiptReviewStore.setState({
    transactionId: null,
    date: '',
    items: [],
    baselineSnapshot: null,
  });
}

function draft(overrides: Partial<ScannedDraft> = {}): ScannedDraft {
  return {
    id: 1,
    date: '2026-03-05',
    totalAmount: 500,
    createdBy: 'ai',
    confirmedAt: null,
    imgPath: null,
    rawAiData: null,
    originalCurrency: null,
    originalTotalAmount: null,
    exchangeRate: null,
    rateIsApproximate: false,
    items: [
      { id: 1, label: 'Milk', amount: 250, categoryId: 11, categoryLabel: 'Dairy' },
      { id: 2, label: 'Bread', amount: 250, categoryId: 12, categoryLabel: 'Bakery' },
    ],
    ...overrides,
  };
}

describe('useReceiptReviewStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('initFromDraft populates transactionId, date, items, and a baseline snapshot', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    const state = useReceiptReviewStore.getState();
    expect(state.transactionId).toBe(1);
    expect(state.date).toBe('2026-03-05');
    expect(state.items).toHaveLength(2);
    expect(state.baselineSnapshot).not.toBeNull();
  });

  it('initFromDraft clones items so mutating the store does not affect the source draft', () => {
    const source = draft();
    useReceiptReviewStore.getState().initFromDraft(source);
    useReceiptReviewStore.getState().updateItem(1, { label: 'Changed' });
    expect(source.items[0].label).toBe('Milk');
  });

  it('setDate updates only the date field', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().setDate('2026-04-01');
    expect(useReceiptReviewStore.getState().date).toBe('2026-04-01');
    expect(useReceiptReviewStore.getState().items).toHaveLength(2);
  });

  it('updateItem patches only the matching item', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().updateItem(2, { label: 'Rye bread', amount: 300 });
    const items = useReceiptReviewStore.getState().items;
    expect(items.find((i) => i.id === 1)?.label).toBe('Milk');
    expect(items.find((i) => i.id === 2)).toMatchObject({
      label: 'Rye bread',
      amount: 300,
    });
  });

  it('removeItem drops only the matching item', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().removeItem(1);
    const items = useReceiptReviewStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(2);
  });

  it('clear resets all fields', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().clear();
    const state = useReceiptReviewStore.getState();
    expect(state.transactionId).toBeNull();
    expect(state.date).toBe('');
    expect(state.items).toEqual([]);
    expect(state.baselineSnapshot).toBeNull();
  });
});

describe('isReceiptReviewDirty', () => {
  beforeEach(() => {
    resetStore();
  });

  it('is false before any draft has been loaded', () => {
    expect(isReceiptReviewDirty()).toBe(false);
  });

  it('is false immediately after loading a draft', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    expect(isReceiptReviewDirty()).toBe(false);
  });

  it('becomes true after editing an item', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().updateItem(1, { amount: 999 });
    expect(isReceiptReviewDirty()).toBe(true);
  });

  it('becomes true after changing the date', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().setDate('2026-04-01');
    expect(isReceiptReviewDirty()).toBe(true);
  });

  it('becomes true after removing an item', () => {
    useReceiptReviewStore.getState().initFromDraft(draft());
    useReceiptReviewStore.getState().removeItem(2);
    expect(isReceiptReviewDirty()).toBe(true);
  });
});

describe('sumReviewItemsMinor', () => {
  it('sums the amount across all items', () => {
    expect(sumReviewItemsMinor(draft().items)).toBe(500);
  });

  it('returns 0 for an empty list', () => {
    expect(sumReviewItemsMinor([])).toBe(0);
  });
});
