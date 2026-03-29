import type { ImagePickerAsset } from 'expo-image-picker';

/** Minimal upload-ready snapshot of a picked receipt image. */
export type NormalizedReceiptImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export function normalizeReceiptAsset(
  asset: ImagePickerAsset | undefined | null,
): NormalizedReceiptImage | null {
  if (!asset) return null;
  const uri = typeof asset.uri === 'string' ? asset.uri.trim() : '';
  if (!uri) return null;

  const fileName =
    asset.fileName != null && asset.fileName !== ''
      ? asset.fileName
      : undefined;
  const mimeType =
    asset.mimeType != null && asset.mimeType !== '' ? asset.mimeType : undefined;
  const fileSize =
    typeof asset.fileSize === 'number' && !Number.isNaN(asset.fileSize)
      ? asset.fileSize
      : undefined;

  return {
    uri,
    ...(fileName !== undefined ? { fileName } : {}),
    ...(mimeType !== undefined ? { mimeType } : {}),
    ...(fileSize !== undefined ? { fileSize } : {}),
  };
}
