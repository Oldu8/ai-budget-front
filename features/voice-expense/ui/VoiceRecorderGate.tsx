import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

export type VoiceRecorderGateVariant = 'noPlan' | 'permissionDenied';

interface VoiceRecorderGateProps {
  variant: VoiceRecorderGateVariant;
  onUpgradePlan?: () => void;
  onRetryPermission?: () => void;
}

export function VoiceRecorderGate({
  variant,
  onUpgradePlan,
  onRetryPermission,
}: VoiceRecorderGateProps) {
  const { t } = useTranslation();

  if (variant === 'noPlan') {
    return (
      <ThemedView style={styles.wrap}>
        <ThemedText type="title" style={styles.title}>
          {t('billing.voiceUpgradeTitle')}
        </ThemedText>
        <ThemedText style={styles.body}>
          {t('billing.voiceUpgradeSubtitle')}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          style={styles.primaryBtn}
          onPress={onUpgradePlan}
        >
          <ThemedText type="defaultSemiBold" style={styles.primaryBtnText}>
            {t('add.voiceExpense.upgradeCta')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.wrap}>
      <ThemedText style={styles.body}>
        {t('add.voiceExpense.permissionDenied')}
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        style={styles.primaryBtn}
        onPress={onRetryPermission}
      >
        <ThemedText type="defaultSemiBold" style={styles.primaryBtnText}>
          {t('add.voiceExpense.error.permissionRetry')}
        </ThemedText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.secondaryBtn}
        onPress={() => void Linking.openSettings()}
      >
        <ThemedText type="defaultSemiBold" style={styles.secondaryBtnText}>
          {t('add.voiceExpense.openSettings')}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  title: {
    color: Colors.primary,
  },
  body: {
    color: Colors.grey,
    lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.white,
  },
  secondaryBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
  },
});
