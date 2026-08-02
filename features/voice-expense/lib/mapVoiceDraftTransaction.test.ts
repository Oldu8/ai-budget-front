import { mapScannedDraft } from '@/features/receipt-scan/lib/mapScannedDraft';

import { mapVoiceDraftTransaction } from './mapVoiceDraftTransaction';

describe('mapVoiceDraftTransaction', () => {
  it('is the same mapper used for receipt scan drafts', () => {
    expect(mapVoiceDraftTransaction).toBe(mapScannedDraft);
  });

  it('maps a voice transaction payload using the shared draft shape', () => {
    const payload = {
      data: {
        id: 7,
        date: '2026-03-05',
        total_amount: 500,
        created_by: 'ai',
        items: [],
      },
    };
    expect(mapVoiceDraftTransaction(payload)).toEqual({
      id: 7,
      date: '2026-03-05',
      totalAmount: 500,
      createdBy: 'ai',
      confirmedAt: null,
      imgPath: null,
      rawAiData: undefined,
      originalCurrency: null,
      originalTotalAmount: null,
      exchangeRate: null,
      rateIsApproximate: false,
      items: [],
    });
  });
});
