import { Platform } from 'react-native';

import { ApiError } from '@/shared/api/client';
import { protectedPostMultipart } from '@/shared/api/protectedClient';

import {
  buildVoiceAudioFormData,
  type VoiceAudioUploadPart,
} from '@/features/voice-expense/lib/createAudioFormData';

export type VoiceExpenseApiResponse = unknown;

const VOICE_UPLOAD_PATH = '/api/transactions/voice';

/** Minimum acceptable audio file size in bytes (avoids uploading an empty file). */
const MIN_AUDIO_BYTES = 512;

function uriSnippet(uri: string): string {
  const max = 80;
  if (uri.length <= max) return uri;
  return `${uri.slice(0, max)}… (len=${uri.length})`;
}

/**
 * Optional dev-only read of native file backing `uri`.
 * Mirrors what we send (RN often reads via fetch(file://) similarly for uploads).
 */
async function probeNativeFileBytes(uri: string): Promise<{
  blobSizeBytes: number | null;
  blobType: string | null;
  probeError?: string;
}> {
  try {
    const res = await fetch(uri);
    if (!res.ok) {
      return {
        blobSizeBytes: null,
        blobType: null,
        probeError: `fetch not ok ${res.status}`,
      };
    }
    const blob = await res.blob();
    return {
      blobSizeBytes: blob.size,
      blobType: blob.type || '(empty)',
    };
  } catch (e) {
    return {
      blobSizeBytes: null,
      blobType: null,
      probeError: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * On native, verifies the recorded file exists and has meaningful content
 * before building FormData.  An empty file (e.g. due to a timing race after
 * recorder.stop()) would reach the backend and immediately cause a 503.
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
    const hasNumericLength = Number.isFinite(length) && length > 0;
    if (__DEV__) {
      console.warn('[voice-upload] assert:HEAD', {
        ok: res.ok,
        contentLengthHeader: lengthRaw,
        inferredBytes: hasNumericLength ? length : '(missing or unreadable)',
        uriSnippet: uriSnippet(uri),
      });
    }

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
    if (__DEV__) {
      console.warn('[voice-upload] assert:HEAD-skip-or-fail', {
        message: err instanceof Error ? err.message : String(err),
        note: 'Native upload may proceed; probeNativeFileBytes validates size separately in __DEV__',
      });
    }
    // HEAD may not be supported for file:// URIs on all platforms; fall through.
  }
}

export async function createVoiceExpense(
  audio: VoiceAudioUploadPart
): Promise<VoiceExpenseApiResponse> {
  const baseLog = {
    platform: Platform.OS,
    mimeDeclared: audio.mimeType,
    fileName: audio.fileName,
    uriSnippet: uriSnippet(audio.uri),
  };

  if (__DEV__) {
    console.warn('[voice-upload] entry', baseLog);
  }

  await assertAudioFileReady(audio.uri);

  if (__DEV__ && Platform.OS !== 'web') {
    const probe = await probeNativeFileBytes(audio.uri);
    console.warn('[voice-upload] native:fetch-probe-before-FormData', {
      ...probe,
      minSuggestedBytes: MIN_AUDIO_BYTES,
    });
  }

  const formData = await buildVoiceAudioFormData(audio);

  if (__DEV__) {
    console.warn('[voice-upload] posting-multipart', {
      path: VOICE_UPLOAD_PATH,
      ...baseLog,
      formDataConstructed: true,
    });
  }

  try {
    const raw = await protectedPostMultipart<VoiceExpenseApiResponse>(
      VOICE_UPLOAD_PATH,
      formData
    );
    if (__DEV__) {
      console.warn('[voice-upload] response OK (body type unknown)', {
        path: VOICE_UPLOAD_PATH,
        hasPayload: raw != null,
      });
    }
    return raw;
  } catch (err) {
    if (__DEV__) {
      const errSummary =
        err instanceof ApiError
          ? {
              name: err.name,
              status: err.status,
              message: err.message,
            }
          : { message: err instanceof Error ? err.message : String(err) };
      console.warn('[voice-upload] POST failed', {
        path: VOICE_UPLOAD_PATH,
        ...baseLog,
        ...errSummary,
      });
    }
    throw err;
  }
}
