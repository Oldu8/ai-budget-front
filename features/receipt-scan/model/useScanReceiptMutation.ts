import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { scanReceipt } from '@/features/receipt-scan/api/scanReceipt';
import { mapScannedDraft } from '@/features/receipt-scan/lib/mapScannedDraft';
import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';
import { useReceiptScanDraftStore } from '@/features/receipt-scan/model/useReceiptScanDraftStore';
import { useReceiptReviewStore } from '@/features/receipt-scan/model/useReceiptReviewStore';
import { Analytics } from '@/shared/analytics';

export function useScanReceiptMutation() {
  const { replace } = useRouter();
  const setDraft = useReceiptScanDraftStore((s) => s.setDraft);
  const initReview = useReceiptReviewStore((s) => s.initFromDraft);

  return useMutation({
    mutationFn: async (image: NormalizedReceiptImage) => {
      const raw = await scanReceipt(image);
      return mapScannedDraft(raw);
    },
    onSuccess: (draft) => {
      Analytics.logReceiptScan(true);
      setDraft(draft);
      initReview(draft);
      replace('/(add)/scan-review' as never);
    },
    onError: () => {
      Analytics.logReceiptScan(false);
    },
  });
}
