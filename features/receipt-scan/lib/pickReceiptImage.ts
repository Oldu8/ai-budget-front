import * as ImagePicker from 'expo-image-picker';

import {
  normalizeReceiptAsset,
  type NormalizedReceiptImage,
} from '@/features/receipt-scan/lib/normalizeReceiptAsset';

const imagePickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,
  quality: 1,
};

export type PickReceiptImageResult =
  | { status: 'success'; image: NormalizedReceiptImage }
  | { status: 'cancelled' }
  | { status: 'permission_denied' };

function resultFromPicker(
  result: ImagePicker.ImagePickerResult,
): PickReceiptImageResult {
  if (result.canceled) return { status: 'cancelled' };
  const image = normalizeReceiptAsset(result.assets[0]);
  if (!image) return { status: 'cancelled' };
  return { status: 'success', image };
}

export async function pickReceiptImageFromCamera(): Promise<PickReceiptImageResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return { status: 'permission_denied' };

  const result = await ImagePicker.launchCameraAsync(imagePickerOptions);
  return resultFromPicker(result);
}

export async function pickReceiptImageFromGallery(): Promise<PickReceiptImageResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return { status: 'permission_denied' };

  const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
  return resultFromPicker(result);
}
