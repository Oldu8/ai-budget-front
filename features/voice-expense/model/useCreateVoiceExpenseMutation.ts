import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useReceiptScanDraftStore } from '@/features/receipt-scan/model/useReceiptScanDraftStore';
import { useReceiptReviewStore } from '@/features/receipt-scan/model/useReceiptReviewStore';
import { createVoiceExpense } from '@/features/voice-expense/api/createVoiceExpense';
import type { VoiceAudioUploadPart } from '@/features/voice-expense/lib/createAudioFormData';
import { mapVoiceDraftTransaction } from '@/features/voice-expense/lib/mapVoiceDraftTransaction';

export function useCreateVoiceExpenseMutation() {
  const { replace } = useRouter();
  const { refetchMe } = useAuthContext();
  const setDraft = useReceiptScanDraftStore((s) => s.setDraft);
  const initReview = useReceiptReviewStore((s) => s.initFromDraft);

  return useMutation({
    mutationFn: async (audio: VoiceAudioUploadPart) => {
      const raw = await createVoiceExpense(audio);
      return mapVoiceDraftTransaction(raw);
    },
    onSuccess: (draft) => {
      setDraft(draft);
      initReview(draft);
      void refetchMe().catch(() => {
        /* keep stale scan_usage rather than blocking */
      });
      replace('/(add)/scan-review' as never);
    },
  });
}
