import { create } from 'zustand';

import type { ScannedDraft } from '@/features/receipt-scan/model/types';

type ReceiptScanDraftState = {
  draft: ScannedDraft | null;
  setDraft: (draft: ScannedDraft) => void;
  clearDraft: () => void;
};

export const useReceiptScanDraftStore = create<ReceiptScanDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
