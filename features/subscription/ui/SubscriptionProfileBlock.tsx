import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import type { ScanUsage, UserSubscription } from '@/entities/user';
import { Colors } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/Button';
import { ThemedText } from '@/shared/ui/ThemedText';

import { formatSubscriptionPeriodEnd } from '../lib/formatSubscriptionPeriodEnd';
import {
  subscriptionBadgeStyles,
  subscriptionStatusTone,
} from '../lib/subscriptionStatusBadge';

export interface SubscriptionProfileBlockProps {
  subscription: UserSubscription | null;
  subscriptionStatus: string | null;
  scanUsage: ScanUsage | null;
  showManageBilling?: boolean;
  onManageBilling?: () => void;
  /** Lines from GET /api/plans for the **current** plan `description` (e.g. billing page). */
  planFeatureLines?: string[] | null;
}

export function SubscriptionProfileBlock({
  subscription,
  subscriptionStatus,
  scanUsage,
  showManageBilling = true,
  onManageBilling,
  planFeatureLines,
}: SubscriptionProfileBlockProps) {
  const { t, i18n } = useTranslation();

  const planLabel = subscription?.plan?.label?.trim()
    ? subscription.plan.label
    : t('subscription.freePlan');

  const statusKey = subscriptionStatus?.trim().toLowerCase() ?? '';
  const badgeLabel =
    statusKey && t(`subscription.status.${statusKey}`, {
      defaultValue: subscriptionStatus?.replace(/_/g, ' ') ?? '',
    });

  const periodIso =
    subscription?.current_period_end?.trim() || scanUsage?.period_end || null;
  const periodFormatted = formatSubscriptionPeriodEnd(periodIso, i18n.language);
  const renewalLine =
    periodFormatted != null
      ? t('subscription.renewsOn', { date: periodFormatted })
      : null;

  const scanLimit = scanUsage?.scans_limit ?? 0;
  const scanRemaining = scanUsage?.scans_remaining ?? 0;
  const scanUsed =
    scanLimit > 0 ? Math.max(0, scanLimit - scanRemaining) : null;
  const progressPct =
    scanLimit > 0 && scanUsed !== null
      ? Math.min(100, Math.round((scanUsed / scanLimit) * 100))
      : null;

  const badgeTone = statusKey
    ? subscriptionStatusTone(subscriptionStatus ?? statusKey)
    : null;
  const badgeColors = badgeTone ? subscriptionBadgeStyles[badgeTone] : null;

  const usedDisplay = useMemo(() => {
    if (scanUsed === null || scanLimit <= 0) return null;
    return `${scanUsed.toLocaleString(i18n.language)} / ${scanLimit.toLocaleString(i18n.language)}`;
  }, [scanUsed, scanLimit, i18n.language]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <ThemedText type="defaultSemiBold" style={styles.planName}>
            {planLabel}
          </ThemedText>
          {renewalLine ? (
            <ThemedText style={styles.renewal}>{renewalLine}</ThemedText>
          ) : null}
        </View>
        {badgeLabel && badgeColors ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: badgeColors.backgroundColor },
            ]}
          >
            <ThemedText
              style={[styles.badgeText, { color: badgeColors.color }]}
            >
              {badgeLabel.toUpperCase()}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {usedDisplay != null && progressPct !== null ? (
        <View style={styles.usageBlock}>
          <View style={styles.usageRow}>
            <ThemedText type="defaultSemiBold" style={styles.usageLabel}>
              {t('subscription.monthlyScanLimit')}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.usageValues}>
              {usedDisplay}
            </ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPct}%` as `${number}%` },
              ]}
            />
          </View>
        </View>
      ) : null}

      {planFeatureLines && planFeatureLines.length > 0 ? (
        <View style={styles.featuresBlock}>
          <ThemedText type="defaultSemiBold" style={styles.featuresTitle}>
            {t('billing.planFeaturesTitle', {
              planName: planLabel,
              defaultValue: '{{planName}} includes',
            })}
          </ThemedText>
          {planFeatureLines.map((line, index) => (
            <View key={`${index}-${line}`} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <ThemedText style={styles.featureText}>{line}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      {showManageBilling && onManageBilling ? (
        <Button
          variant="primary"
          style={styles.cta}
          onPress={onManageBilling}
        >
          {t('subscription.manageBilling')}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  planName: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 4,
  },
  renewal: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  usageBlock: {
    marginTop: 24,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  usageLabel: {
    fontSize: 15,
    color: Colors.primary,
    flex: 1,
    marginRight: 8,
  },
  usageValues: {
    fontSize: 15,
    color: Colors.primary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.greyHover,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  featuresBlock: {
    marginTop: 20,
    gap: 8,
  },
  featuresTitle: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  featureText: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 20,
    flex: 1,
  },
  cta: {
    marginTop: 28,
    width: '100%',
  },
});
