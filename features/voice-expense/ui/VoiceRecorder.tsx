import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { planIncludesPaidFeature } from '@/features/billing/lib/planEntitlements';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import type { VoiceAudioUploadPart } from '@/features/voice-expense/lib/createAudioFormData';
import { getVoiceExpenseErrorPresentation } from '@/features/voice-expense/lib/getVoiceExpenseErrorText';
import { useCreateVoiceExpenseMutation } from '@/features/voice-expense/model/useCreateVoiceExpenseMutation';
import { VoiceExpenseProcessingOverlay } from '@/features/voice-expense/ui/VoiceExpenseProcessingOverlay';
import { VoiceRecordButton } from '@/features/voice-expense/ui/VoiceRecordButton';
import { VoiceRecorderGate } from '@/features/voice-expense/ui/VoiceRecorderGate';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

const MAX_DURATION_SEC = 30;
const MIN_DURATION_SEC = 2;

const MOBILE_UPLOAD_META: Omit<VoiceAudioUploadPart, 'uri'> = {
  fileName: 'voice-expense.m4a',
  mimeType: 'audio/mp4',
};

type FlowPhase =
  | 'idle'
  | 'recording'
  | 'ready'
  | 'uploading'
  | 'permissionDenied';

export function VoiceRecorder() {
  const { t } = useTranslation();
  const { subscription } = useAuthContext();
  const openPaywall = usePaywallStore((s) => s.open);
  const mutation = useCreateVoiceExpenseMutation();
  const { mutateAsync: mutateVoiceExpense, isPending: isMutationPending } =
    mutation;

  const planType = subscription?.plan?.type ?? PlanType.Free;
  const hasVoice = planIncludesPaidFeature(planType, 'voiceExpense');

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder, 100);

  const [phase, setPhase] = useState<FlowPhase>('idle');
  const [errorBanner, setErrorBanner] = useState<
    ReturnType<typeof getVoiceExpenseErrorPresentation> | null
  >(null);

  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Max observed duration this session — survives expo-audio resetting millis after stop (ready / retry send). */
  const voiceSessionMaxDurationSecRef = useRef(0);
  /** Real time when `record()` started; guards against broken `durationMillis`/URI from native while still recording. */
  const recordingWallClockMsRef = useRef<number | null>(null);

  const isUploading = phase === 'uploading' || isMutationPending;

  const clearAutoStop = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const stopRecordingCore = useCallback(async () => {
    clearAutoStop();
    const wallStarted = recordingWallClockMsRef.current;
    if (wallStarted != null) {
      const wallSec = Math.max(0, (Date.now() - wallStarted) / 1000);
      voiceSessionMaxDurationSecRef.current = Math.max(
        voiceSessionMaxDurationSecRef.current,
        wallSec
      );
      recordingWallClockMsRef.current = null;
    }
    let durationMillis = 0;
    try {
      const before = recorder.getStatus();
      durationMillis = before.durationMillis;
      if (before.isRecording) {
        await recorder.stop();
      }
    } catch {
      /* noop */
    }
    const after = recorder.getStatus();
    /** After stop, some platforms reset durationMillis; keep the longest snapshot. */
    durationMillis = Math.max(durationMillis, after.durationMillis);
    voiceSessionMaxDurationSecRef.current = Math.max(
      voiceSessionMaxDurationSecRef.current,
      durationMillis / 1000
    );
    const uri = recorder.uri ?? after.url;
    return { uri, durationSec: durationMillis / 1000 };
  }, [clearAutoStop, recorder]);

  /** Unmount cleanup: stop recording and clear timers. */
  useEffect(() => {
    return () => {
      clearAutoStop();
      void (async () => {
        try {
          if (recorder.getStatus().isRecording) {
            await recorder.stop();
          }
        } catch {
          /* noop */
        }
      })();
    };
  }, [clearAutoStop, recorder]);

  /** While recording, keep a client-side peak duration for send validation after native state resets. */
  useEffect(() => {
    if (phase !== 'recording') return;
    const sec = recState.durationMillis / 1000;
    if (sec > voiceSessionMaxDurationSecRef.current) {
      voiceSessionMaxDurationSecRef.current = sec;
    }
  }, [phase, recState.durationMillis]);

  const startRecording = useCallback(async () => {
    if (isUploading) return;

    setErrorBanner(null);
    voiceSessionMaxDurationSecRef.current = 0;
    recordingWallClockMsRef.current = null;

    const existing = await getRecordingPermissionsAsync();
    let granted = existing.granted;
    if (!granted) {
      const req = await requestRecordingPermissionsAsync();
      granted = req.granted;
    }
    if (!granted) {
      setPhase('permissionDenied');
      return;
    }

    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
        interruptionMode: 'duckOthers',
        shouldPlayInBackground: false,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      recordingWallClockMsRef.current = Date.now();
      setPhase('recording');

      autoStopTimerRef.current = setTimeout(() => {
        void (async () => {
          await stopRecordingCore();
          setPhase('ready');
        })();
      }, MAX_DURATION_SEC * 1000);
    } catch {
      recordingWallClockMsRef.current = null;
      setPhase('idle');
      setErrorBanner({
        kind: 'i18n',
        i18nKey: 'error.generic',
      });
    }
  }, [
    isUploading,
    recorder,
    stopRecordingCore,
  ]);

  const cancelSession = useCallback(async () => {
    if (isUploading) return;
    clearAutoStop();
    try {
      const st = recorder.getStatus();
      if (st.isRecording) {
        await recorder.stop();
      }
    } catch {
      /* noop */
    }
    voiceSessionMaxDurationSecRef.current = 0;
    recordingWallClockMsRef.current = null;
    setPhase('idle');
    setErrorBanner(null);
  }, [clearAutoStop, isUploading, recorder]);

  const onSend = useCallback(async () => {
    if (isMutationPending || isUploading) return;

    const statusAtSend = recorder.getStatus();
    const nativeDurSec =
      statusAtSend.durationMillis <= 0
        ? 0
        : statusAtSend.durationMillis / 1000;

    let uri: string | null = recorder.uri ?? recState.url;
    let durationSec = Math.max(
      recState.durationMillis / 1000,
      voiceSessionMaxDurationSecRef.current,
      nativeDurSec
    );

    /** Monotonic-ish fallback while the mic is still active (before `stopRecordingCore` folds wall clock into ref). */
    if (recordingWallClockMsRef.current != null) {
      const wallSec = Math.max(0, (Date.now() - recordingWallClockMsRef.current) / 1000);
      durationSec = Math.max(durationSec, wallSec);
    }

    /** Retry after stop/upload: millis/ref may be 0 while a finalized file URI still exists. */
    const finalizedUri = uri ?? recorder.uri ?? recState.url;
    const readyHasFinalizedClip =
      phase === 'ready' &&
      typeof finalizedUri === 'string' &&
      finalizedUri.length > 0;

    /**
     * `useAudioRecorderState` can lag native by >50ms change threshold; rely on synchronous `getStatus`.
     * If native still records but React phase is stale, finalize anyway.
     */
    const mustFinalizeActiveRecorder =
      phase === 'recording' || statusAtSend.isRecording;

    let trustClipFromRecordingStop = false;

    if (mustFinalizeActiveRecorder) {
      const live = recorder.getStatus();
      const uiDurationSec = Math.max(
        recState.durationMillis / 1000,
        live.durationMillis <= 0 ? 0 : live.durationMillis / 1000,
        recordingWallClockMsRef.current != null
          ? Math.max(0, (Date.now() - recordingWallClockMsRef.current) / 1000)
          : 0
      );
      const captured = await stopRecordingCore();
      uri =
        captured.uri ??
        recorder.uri ??
        recorder.getStatus().url ??
        null;
      durationSec = Math.max(
        captured.durationSec,
        uiDurationSec,
        voiceSessionMaxDurationSecRef.current
      );
      trustClipFromRecordingStop =
        typeof uri === 'string' && uri.length > 0;
    }

    durationSec = Math.max(durationSec, voiceSessionMaxDurationSecRef.current);

    const sessionRefClearlyLongEnough =
      voiceSessionMaxDurationSecRef.current + 1e-6 >= MIN_DURATION_SEC;

    const tooShort =
      readyHasFinalizedClip ||
      trustClipFromRecordingStop ||
      sessionRefClearlyLongEnough
        ? false
        : durationSec + 1e-6 < MIN_DURATION_SEC;

    if (tooShort) {
      recordingWallClockMsRef.current = null;
      setErrorBanner({
        kind: 'i18n',
        i18nKey: 'error.tooShort',
      });
      setPhase('idle');
      return;
    }

    if (!uri) {
      recordingWallClockMsRef.current = null;
      setErrorBanner({
        kind: 'i18n',
        i18nKey: 'error.noAudio',
      });
      setPhase('idle');
      return;
    }

    try {
      setPhase('uploading');
      await mutateVoiceExpense({ uri, ...MOBILE_UPLOAD_META });
    } catch (err: unknown) {
      clearAutoStop();
      try {
        if (recorder.getStatus().isRecording) {
          await recorder.stop();
        }
      } catch {
        /* noop */
      }
      voiceSessionMaxDurationSecRef.current = 0;
      recordingWallClockMsRef.current = null;
      setPhase('idle');
      setErrorBanner(getVoiceExpenseErrorPresentation(err));
    }
  }, [
    phase,
    isUploading,
    isMutationPending,
    mutateVoiceExpense,
    recState.durationMillis,
    recState.url,
    recorder,
    stopRecordingCore,
    clearAutoStop,
  ]);

  const errorBannerText = (() => {
    if (!errorBanner) return null;
    if (errorBanner.kind === 'message') {
      return errorBanner.message;
    }
    return t(`add.voiceExpense.${errorBanner.i18nKey}`, {
      defaultValue: t('add.voiceExpense.error.generic'),
    });
  })();

  if (!hasVoice) {
    return (
      <VoiceRecorderGate
        variant="noPlan"
        onUpgradePlan={() =>
          openPaywall({
            title: t('billing.voiceUpgradeTitle'),
            reasonText: t('billing.voiceUpgradeSubtitle'),
          })
        }
      />
    );
  }

  if (phase === 'permissionDenied') {
    return (
      <VoiceRecorderGate
        variant="permissionDenied"
        onRetryPermission={() => {
          setPhase('idle');
          void startRecording();
        }}
      />
    );
  }

  if (phase === 'uploading') {
    return (
      <VoiceExpenseProcessingOverlay
        title={t('add.voiceExpense.processing.title')}
        subtitle={t('add.voiceExpense.processing.subtitle')}
      />
    );
  }

  const progress = Math.min(
    1,
    recState.durationMillis / 1000 / MAX_DURATION_SEC
  );
  const timerLabel = `${Math.min(
    MAX_DURATION_SEC,
    Math.floor(recState.durationMillis / 1000)
  )}s / ${MAX_DURATION_SEC}s`;

  const INSTRUCTIONS = [
    t('add.voiceExpense.instruction1'),
    t('add.voiceExpense.instruction2'),
    t('add.voiceExpense.instruction3'),
    t('add.voiceExpense.instruction4'),
  ];

  const EXAMPLES = [
    t('add.voiceExpense.example1'),
    t('add.voiceExpense.example2'),
    t('add.voiceExpense.example3'),
  ];

  return (
    <ThemedView style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {errorBanner && errorBannerText ? (
          <View
            style={styles.bannerError}
            accessibilityRole="alert"
          >
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={22}
              color={Colors.error}
            />
            <View style={styles.bannerErrorBody}>
              <ThemedText type="defaultSemiBold" style={styles.bannerTitle}>
                {t('add.voiceExpense.errorBannerTitle')}
              </ThemedText>
              <ThemedText style={styles.bannerText}>{errorBannerText}</ThemedText>
            {errorBanner.showUpgradeButton ? (
              <Pressable
                accessibilityRole="button"
                style={styles.bannerUpgrade}
                onPress={() => {
                  const isQuota = (errorBanner.upgradePaywall ?? 'quota') === 'quota';
                  openPaywall({
                    title: t(isQuota ? 'billing.voiceQuotaTitle' : 'billing.voiceUpgradeTitle'),
                    reasonText: t(isQuota ? 'billing.voiceQuotaSubtitle' : 'billing.voiceUpgradeSubtitle'),
                  });
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.bannerUpgradeText}>
                  {t('add.voiceExpense.upgradeCta')}
                </ThemedText>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => setErrorBanner(null)}
              style={styles.dismiss}
            >
              <ThemedText style={styles.dismissText}>
                {t('add.voiceExpense.tryAgain')}
              </ThemedText>
            </Pressable>
            </View>
          </View>
        ) : null}

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t('add.voiceExpense.instructionsTitle')}
        </ThemedText>
        {INSTRUCTIONS.map((text, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.stepBadge}>
              <ThemedText style={styles.stepNumber}>{i + 1}</ThemedText>
            </View>
            <ThemedText style={styles.bulletText}>{text}</ThemedText>
          </View>
        ))}

        <ThemedText type="defaultSemiBold" style={styles.examplesTitle}>
          {t('add.voiceExpense.examplesTitle')}
        </ThemedText>
        {EXAMPLES.map((text, i) => (
          <View key={i} style={styles.exampleRow}>
            <ThemedText style={styles.exampleMark}>&ldquo;</ThemedText>
            <ThemedText style={styles.example}>{text}</ThemedText>
          </View>
        ))}

        <View style={styles.recordBlock}>
          {phase === 'idle' ? (
            <VoiceRecordButton
              isRecording={false}
              disabled={isUploading}
              accessibilityLabel={t('add.voiceExpense.startRecording')}
              label={t('add.voiceExpense.startRecording')}
              onPress={() => void startRecording()}
            />
          ) : null}

          {phase === 'recording' || phase === 'ready' ? (
            <View style={styles.activeRow}>
              <View style={styles.timerBlock}>
                <ThemedText type="defaultSemiBold">{timerLabel}</ThemedText>
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${progress * 100}%` }]}
                  />
                </View>
                <ThemedText style={styles.maxHint}>
                  {t('add.voiceExpense.maxDurationHint', {
                    seconds: MAX_DURATION_SEC,
                  })}
                </ThemedText>
              </View>
              <View style={styles.actionsRow}>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.actionBtn,
                    styles.sendBtn,
                    isUploading && styles.btnDisabled,
                  ]}
                  disabled={isUploading}
                  onPress={() => void onSend()}
                >
                  <ThemedText type="defaultSemiBold" style={styles.sendBtnText}>
                    {t('add.voiceExpense.send')}
                  </ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.actionBtn,
                    styles.cancelBtn,
                    isUploading && styles.btnDisabled,
                  ]}
                  disabled={isUploading}
                  onPress={() => void cancelSession()}
                >
                  <ThemedText type="defaultSemiBold" style={styles.cancelBtnText}>
                    {t('add.voiceExpense.cancel')}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    color: Colors.primary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumber: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  bulletText: {
    flex: 1,
    color: Colors.black,
    lineHeight: 20,
    fontSize: 14,
  },
  examplesTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: Colors.primary,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  exampleMark: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  example: {
    flex: 1,
    color: Colors.grey,
    fontStyle: 'italic',
    lineHeight: 20,
    fontSize: 14,
  },
  recordBlock: {
    marginTop: 28,
    width: '100%',
    alignItems: 'center',
  },
  activeRow: {
    width: '100%',
    gap: 16,
  },
  timerBlock: {
    width: '100%',
    gap: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.greyHover,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  maxHint: {
    fontSize: 12,
    color: Colors.grey,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: Colors.primary,
  },
  sendBtnText: {
    color: Colors.white,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.grey,
    backgroundColor: Colors.white,
  },
  cancelBtnText: {
    color: Colors.grey,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  bannerError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  bannerErrorBody: {
    flex: 1,
    gap: 8,
  },
  bannerTitle: {
    color: Colors.error,
    fontSize: 15,
    lineHeight: 20,
  },
  bannerText: {
    color: '#450a0a',
    fontSize: 14,
    lineHeight: 20,
  },
  bannerUpgrade: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerUpgradeText: {
    color: Colors.white,
  },
  dismiss: {
    alignSelf: 'flex-start',
  },
  dismissText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
