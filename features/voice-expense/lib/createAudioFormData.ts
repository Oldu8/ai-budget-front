import { Platform } from 'react-native';

export type VoiceAudioUploadPart = {
  uri: string;
  fileName: string;
  mimeType: string;
};

/**
 * Build multipart body for `/api/transactions/voice`.
 * Mirrors `scanReceipt.ts`: web uses Blob/File; native uses RN file descriptor.
 * Does not set Content-Type — `protectedPostMultipart` leaves boundary to the runtime.
 */
export async function buildVoiceAudioFormData(
  audio: VoiceAudioUploadPart
): Promise<FormData> {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const res = await fetch(audio.uri);
    const blob = await res.blob();
    // Use the actual blob MIME type (e.g. 'audio/webm' on web) instead of the
    // hardcoded mobile preset ('audio/mp4').  Sending the wrong Content-Type
    // causes the backend to immediately reject the file with 503.
    const actualMimeType = blob.type || audio.mimeType;
    if (__DEV__) {
      console.warn('[voice-upload] buildFormData:web-blob', {
        blobSizeBytes: blob.size,
        blobTypeRaw: blob.type || '(empty string)',
        fileNameUsed: audio.fileName,
        mimePassedToFile: actualMimeType,
        declaredPresetMime: audio.mimeType,
      });
    }
    const file = new File([blob], audio.fileName, { type: actualMimeType });
    formData.append('audio', file);
    return formData;
  }

  formData.append('audio', {
    uri: audio.uri,
    name: audio.fileName,
    type: audio.mimeType,
  } as unknown as Blob);

  if (__DEV__) {
    console.warn('[voice-upload] buildFormData:native-append', {
      fileNameUsed: audio.fileName,
      typeField: audio.mimeType,
      uriScheme: audio.uri.split(':')[0],
      uriLength: audio.uri.length,
    });
  }

  return formData;
}
