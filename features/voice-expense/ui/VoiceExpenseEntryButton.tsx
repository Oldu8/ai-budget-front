import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { planIncludesPaidFeature } from '@/features/billing/lib/planEntitlements';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

interface VoiceExpenseEntryButtonProps {
  onGrantedNavigate: () => void;
}

/**
 * Visible to everyone: Premium + scan quota navigates to voice; otherwise opens paywall
 * with plan or quota-specific copy.
 */
export function VoiceExpenseEntryButton({
  onGrantedNavigate,
}: VoiceExpenseEntryButtonProps) {
  const { t } = useTranslation();
  const { status, subscription, scanUsage } = useAuthContext();
  const openPaywall = usePaywallStore((s) => s.open);

  const scansRemaining = scanUsage?.scans_remaining ?? 0;
  const planType = subscription?.plan?.type ?? PlanType.Free;
  const hasVoice = planIncludesPaidFeature(planType, 'voiceExpense');

  const onPress = useCallback(() => {
    if (status !== 'authenticated') {
      router.replace('/(auth)/login' as never);
      return;
    }

    if (!hasVoice) {
      openPaywall({
        title: t('billing.voiceUpgradeTitle'),
        reasonText: t('billing.voiceUpgradeSubtitle'),
      });
      return;
    }

    if (scansRemaining <= 0) {
      openPaywall({
        title: t('billing.voiceQuotaTitle'),
        reasonText: t('billing.voiceQuotaSubtitle'),
      });
      return;
    }

    onGrantedNavigate();
  }, [
    status,
    hasVoice,
    scansRemaining,
    openPaywall,
    onGrantedNavigate,
    t,
  ]);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('add.voiceExpense.entryButtonLabel')}
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {t('add.voiceExpense.entryButtonLabel')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('add.voiceExpense.entryButtonSubtitle')}
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
        padding: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      },
    }),
  },
  pressable: {
    padding: 16,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  textBlock: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 18,
    textAlign: 'center',
  },
});
