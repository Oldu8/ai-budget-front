import * as ImagePicker from 'expo-image-picker';

import {
  normalizeReceiptAsset,
  type NormalizedReceiptImage,
} from '@/features/receipt-scan/lib/normalizeReceiptAsset';

// iOS Photos often return HEIC/HEIF while our receipt scan API validates jpeg/png/webp.
// allowsEditing + quality nudges Expo/ImagePicker toward a re-encoded, more compatible image for upload
// without running a separate transcoding pipeline.
const imagePickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
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
