import type { ImagePickerAsset } from 'expo-image-picker';

import { normalizeReceiptAsset } from './normalizeReceiptAsset';

function asset(overrides: Partial<ImagePickerAsset> = {}): ImagePickerAsset {
  return {
    uri: 'file:///receipt.jpg',
    fileName: 'receipt.jpg',
    mimeType: 'image/jpeg',
    fileSize: 1024,
    ...overrides,
  } as ImagePickerAsset;
}

describe('normalizeReceiptAsset', () => {
  it('returns null for null or undefined input', () => {
    expect(normalizeReceiptAsset(null)).toBeNull();
    expect(normalizeReceiptAsset(undefined)).toBeNull();
  });

  it('returns null when the uri is missing or blank', () => {
    expect(normalizeReceiptAsset(asset({ uri: '' }))).toBeNull();
    expect(normalizeReceiptAsset(asset({ uri: '   ' }))).toBeNull();
  });

  it('passes through a normal jpeg asset', () => {
    expect(normalizeReceiptAsset(asset())).toEqual({
      uri: 'file:///receipt.jpg',
      fileName: 'receipt.jpg',
      mimeType: 'image/jpeg',
      fileSize: 1024,
    });
  });

  it('generates a fallback file name when missing', () => {
    const result = normalizeReceiptAsset(asset({ fileName: undefined }));
    expect(result?.fileName).toMatch(/^receipt-\d+\.jpg$/);
  });

  it('rewrites a .heic file name extension to .jpg', () => {
    const result = normalizeReceiptAsset(asset({ fileName: 'photo.HEIC' }));
    expect(result?.fileName).toBe('photo.jpg');
  });

  it('rewrites a .heif file name extension to .jpg', () => {
    const result = normalizeReceiptAsset(asset({ fileName: 'photo.heif' }));
    expect(result?.fileName).toBe('photo.jpg');
  });

  it('defaults a missing mime type to image/jpeg', () => {
    const result = normalizeReceiptAsset(asset({ mimeType: undefined }));
    expect(result?.mimeType).toBe('image/jpeg');
  });

  it('coerces a heic/heif mime type to image/jpeg', () => {
    expect(normalizeReceiptAsset(asset({ mimeType: 'image/heic' }))?.mimeType).toBe(
      'image/jpeg',
    );
    expect(normalizeReceiptAsset(asset({ mimeType: 'image/HEIF' }))?.mimeType).toBe(
      'image/jpeg',
    );
  });

  it('omits fileSize when it is not a valid number', () => {
    const result = normalizeReceiptAsset(asset({ fileSize: NaN }));
    expect(result).not.toHaveProperty('fileSize');
  });

  it('omits fileSize entirely when missing', () => {
    const result = normalizeReceiptAsset(asset({ fileSize: undefined }));
    expect(result).not.toHaveProperty('fileSize');
  });
});
