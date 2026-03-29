import type { ImagePickerAsset } from 'expo-image-picker';

/** Minimal upload-ready snapshot of a picked receipt image. */
export type NormalizedReceiptImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

function replaceHeicExtension(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) {
    return `${name.slice(0, -5)}.jpg`;
  }
  return name;
}

export function normalizeReceiptAsset(
  asset: ImagePickerAsset | undefined | null,
): NormalizedReceiptImage | null {
  if (!asset) return null;
  const uri = typeof asset.uri === 'string' ? asset.uri.trim() : '';
  if (!uri) return null;

  let fileName =
    asset.fileName != null && asset.fileName !== ''
      ? replaceHeicExtension(asset.fileName)
      : `receipt-${Date.now()}.jpg`;

  fileName = replaceHeicExtension(fileName);

  let mimeType =
    asset.mimeType != null && asset.mimeType !== ''
      ? asset.mimeType
      : 'image/jpeg';
  const mt = mimeType.toLowerCase();
  if (mt.includes('heic') || mt.includes('heif')) {
    mimeType = 'image/jpeg';
  }

  const fileSize =
    typeof asset.fileSize === 'number' && !Number.isNaN(asset.fileSize)
      ? asset.fileSize
      : undefined;

  return {
    uri,
    fileName,
    mimeType,
    ...(fileSize !== undefined ? { fileSize } : {}),
  };
}
