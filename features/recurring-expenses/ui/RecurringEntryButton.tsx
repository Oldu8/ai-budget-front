import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { usePaidFeatureGate } from '@/features/billing';
import { AddEntryOptionCard } from '@/shared/ui/AddEntryOptionCard';

interface RecurringEntryButtonProps {
  onGrantedNavigate: () => void;
}

export function RecurringEntryButton({
  onGrantedNavigate,
}: RecurringEntryButtonProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { status } = useAuthContext();
  const { requestAccess } = usePaidFeatureGate();

  const onPress = useCallback(() => {
    if (status !== 'authenticated') {
      router.replace('/(auth)/login' as never);
      return;
    }
    requestAccess(
      'recurringExpenses',
      onGrantedNavigate,
      {
        title: t('recurring.paywall.title'),
        reasonText: t('recurring.paywall.reason'),
      }
    );
  }, [onGrantedNavigate, requestAccess, router, status, t]);

  return (
    <AddEntryOptionCard
      title={t('recurring.entryTitle')}
      subtitle={t('recurring.entrySubtitle')}
      onPress={onPress}
    />
  );
}
