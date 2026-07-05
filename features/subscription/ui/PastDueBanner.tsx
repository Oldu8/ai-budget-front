import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/shared/ui/Button';
import { ThemedText } from '@/shared/ui/ThemedText';

import { getPastDueDaysRemaining, PAST_DUE_GRACE_DAYS } from '../lib/pastDueGrace';

function getPastDueBodyKey(daysLeft: number | null): {
  key: string;
  days: number;
} {
  const days = daysLeft ?? PAST_DUE_GRACE_DAYS;
  if (days === 0) return { key: 'subscription.pastDueBodyToday', days };
  if (days === 1) return { key: 'subscription.pastDueBodyOneDay', days };
  return { key: 'subscription.pastDueBodyDays', days };
}

export interface PastDueBannerProps {
  planLabel: string;
  periodIso: string | null;
  onManageBilling?: () => void;
}

export function PastDueBanner({
  planLabel,
  periodIso,
  onManageBilling,
}: PastDueBannerProps) {
  const { t } = useTranslation();
  const daysLeft = getPastDueDaysRemaining(periodIso);
  const { key: bodyKey, days } = getPastDueBodyKey(daysLeft);

  return (
    <View style={styles.banner}>
      <View style={styles.header}>
        <MaterialIcons name="error-outline" size={20} color="#991B1B" />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {t('subscription.pastDueTitle')}
        </ThemedText>
      </View>
      <ThemedText style={styles.body}>
        {t(bodyKey, { planName: planLabel, days })}
      </ThemedText>
      {onManageBilling ? (
        <Button variant="primary" style={styles.cta} onPress={onManageBilling}>
          {t('subscription.pastDueCta')}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    color: '#991B1B',
  },
  body: {
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 20,
  },
  cta: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#991B1B',
  },
});
