import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { planIncludesPaidFeature } from '@/features/billing/lib/planEntitlements';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { AddEntryOptionCard } from '@/shared/ui/AddEntryOptionCard';

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
    <AddEntryOptionCard
      title={t('add.voiceExpense.entryButtonLabel')}
      subtitle={t('add.voiceExpense.entryButtonSubtitle')}
      onPress={onPress}
    />
  );
}
