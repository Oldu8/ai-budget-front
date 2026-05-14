import { Platform } from 'react-native';

import { protectedPostMultipart } from '@/shared/api/protectedClient';

import {
  buildVoiceAudioFormData,
  type VoiceAudioUploadPart,
} from '@/features/voice-expense/lib/createAudioFormData';

export type VoiceExpenseApiResponse = unknown;

const VOICE_UPLOAD_PATH = '/api/transactions/voice';

/** Minimum acceptable audio file size in bytes (avoids uploading an empty file). */
const MIN_AUDIO_BYTES = 512;

/**
 * On native, verifies the recorded file exists and has meaningful content
 * before building FormData. An empty file (e.g. due to a timing race after
 * recorder.stop()) could reach the backend and fail processing.
 */
async function assertAudioFileReady(uri: string): Promise<void> {
  if (Platform.OS === 'web') return; // blob: URLs always have content

  try {
    const res = await fetch(uri, { method: 'HEAD' });
    const lengthRaw = res.headers.get('content-length');
    const length =
      typeof lengthRaw === 'string' && lengthRaw !== ''
        ? Number(lengthRaw)
        : NaN;

    /** Many `file:` URIs do not populate Content-Length for HEAD — do not rely on HEAD alone. */
    if (Number.isFinite(length) && res.ok && length < MIN_AUDIO_BYTES) {
      throw new Error('Audio file is empty or too small (HEAD)');
    }
  } catch (err) {
    const isDefiniteEmpty =
      err instanceof Error && err.message.includes('too small');
    if (isDefiniteEmpty) {
      throw err;
    }
    // HEAD may not be supported for file:// URIs on all platforms; fall through.
  }
}

export async function createVoiceExpense(
  audio: VoiceAudioUploadPart
): Promise<VoiceExpenseApiResponse> {
  await assertAudioFileReady(audio.uri);

  const formData = await buildVoiceAudioFormData(audio);

  return protectedPostMultipart<VoiceExpenseApiResponse>(
    VOICE_UPLOAD_PATH,
    formData
  );
}
