import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { scanReceipt } from "@/features/receipt-scan/api/scanReceipt";
import { getScanErrorToastText } from "@/features/receipt-scan/lib/getScanErrorToastText";
import { mapScannedDraft } from "@/features/receipt-scan/lib/mapScannedDraft";
import type { NormalizedReceiptImage } from "@/features/receipt-scan/lib/normalizeReceiptAsset";
import { useReceiptScanDraftStore } from "@/features/receipt-scan/model/useReceiptScanDraftStore";
import { useReceiptReviewStore } from "@/features/receipt-scan/model/useReceiptReviewStore";
import { useToast } from "@/shared/ui/Toast";

export function useScanReceiptMutation() {
  const { replace } = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const setDraft = useReceiptScanDraftStore((s) => s.setDraft);
  const initReview = useReceiptReviewStore((s) => s.initFromDraft);

  const mutation = useMutation({
    mutationFn: async (image: NormalizedReceiptImage) => {
      const raw = await scanReceipt(image);
      return mapScannedDraft(raw);
    },
    onSuccess: (draft) => {
      setDraft(draft);
      initReview(draft);
      replace("/(add)/scan-review" as never);
    },
    onError: (err) => {
      showToast({
        title: t("add.toast.errorTitle"),
        text: getScanErrorToastText(err, t),
        type: "error",
      });
    },
  });

  return mutation;
}
