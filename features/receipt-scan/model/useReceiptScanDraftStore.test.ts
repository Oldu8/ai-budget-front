import type { ScannedDraft } from './types';
import { useReceiptScanDraftStore } from './useReceiptScanDraftStore';

function draft(): ScannedDraft {
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
    items: [],
  };
}

describe('useReceiptScanDraftStore', () => {
  beforeEach(() => {
    useReceiptScanDraftStore.setState({ draft: null });
  });

  it('starts with no draft', () => {
    expect(useReceiptScanDraftStore.getState().draft).toBeNull();
  });

  it('setDraft stores the draft', () => {
    useReceiptScanDraftStore.getState().setDraft(draft());
    expect(useReceiptScanDraftStore.getState().draft?.id).toBe(1);
  });

  it('clearDraft removes the stored draft', () => {
    useReceiptScanDraftStore.getState().setDraft(draft());
    useReceiptScanDraftStore.getState().clearDraft();
    expect(useReceiptScanDraftStore.getState().draft).toBeNull();
  });
});
