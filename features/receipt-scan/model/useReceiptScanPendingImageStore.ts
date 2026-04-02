import { create } from 'zustand';

import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';

type ReceiptScanPendingImageState = {
  pendingImage: NormalizedReceiptImage | null;
  setPendingImage: (image: NormalizedReceiptImage | null) => void;
  clear: () => void;
};

export const useReceiptScanPendingImageStore =
  create<ReceiptScanPendingImageState>((set) => ({
    pendingImage: null,
    setPendingImage: (image) => set({ pendingImage: image }),
    clear: () => set({ pendingImage: null }),
  }));
