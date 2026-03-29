import { Platform } from "react-native";

import type { NormalizedReceiptImage } from "@/features/receipt-scan/lib/normalizeReceiptAsset";
import { protectedPostMultipart } from "@/shared/api/protectedClient";

export type ScanReceiptApiResponse = unknown;

export async function scanReceipt(
  image: NormalizedReceiptImage,
): Promise<ScanReceiptApiResponse> {
  const formData = new FormData();
  const name = image.fileName ?? `receipt-${Date.now()}.jpg`;
  const type = image.mimeType ?? "image/jpeg";

  // Browser FormData only accepts Blob/File; RN uses { uri, name, type }.
  if (Platform.OS === "web") {
    const res = await fetch(image.uri);
    const blob = await res.blob();
    const file = new File([blob], name, { type });
    formData.append("image", file);
  } else {
    formData.append("image", {
      uri: image.uri,
      name,
      type,
    } as unknown as Blob);
  }

  return protectedPostMultipart<ScanReceiptApiResponse>(
    "/api/transactions/scan",
    formData,
  );
}
