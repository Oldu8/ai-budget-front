import { getAveragePerDayMonthOverMonth } from '@/features/analytics/lib/averagePerDayMonthOverMonth';
import {
  formatDiffPercent,
  formatSignedMinorCurrency,
} from '@/features/analytics/lib/formatAnalytics';
import type {
  AnalyticsDashboardResponse,
  AnalyticsDirection,
} from '@/features/analytics/model/types';
import { Colors } from '@/shared/constants/theme';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';

type AnalyticsOverviewCardsProps = {
  data: AnalyticsDashboardResponse;
};

/** Large figure color — deep teal (reference UI), distinct from sidebar primary. */
const OVERVIEW_CARD_VALUE_TEAL = '#003d33';
const OVERVIEW_CARD_LABEL_MUTED = '#787880';
const OVERVIEW_POSITIVE_DELTA = '#15803d';

function trendDeltaColor(direction: AnalyticsDirection): string {
  if (direction === 'down') {
    return Colors.error;
  }
  if (direction === 'up') {
    return OVERVIEW_POSITIVE_DELTA;
  }
  return OVERVIEW_CARD_VALUE_TEAL;
}
/** Rounded percent label for subtitle (e.g. 85 vs 84.92). */
function formatSharePercentRounded(percent: number): string {
  const nearest = Math.round(percent);
  if (Math.abs(percent - nearest) < 0.05) {
    return String(nearest);
  }
  return percent.toFixed(1);
}

type OverviewCardChromeProps = {
  label: string;
  children: React.ReactNode;
};

function OverviewCardChrome({ label, children }: OverviewCardChromeProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardLabel} numberOfLines={2}>
        {label}
      </ThemedText>
      <View style={styles.cardBody}>{children}</View>
    </ThemedView>
  );
}

export function AnalyticsOverviewCards({ data }: AnalyticsOverviewCardsProps) {
  const { t } = useTranslation();
  const labels = useMemo(
    () => ({
      newLabel: t('analytics.new'),
    }),
    [t]
  );

  const overviewDirection = data.overview.direction;
  const comparedAmountFormatted = formatSignedMinorCurrency(
    overviewDirection,
    data.overview.difference_amount,
    data.currency
  );
  const comparedPercentFormatted = formatDiffPercent(
    data.overview.difference_percent,
    overviewDirection,
    labels
  );

  const biggest = data.overview.biggest_category;

  const averagePerDayMom = useMemo(
    () => getAveragePerDayMonthOverMonth(data),
    [data]
  );
  const averagePerDayPercentFormatted = formatDiffPercent(
    averagePerDayMom.differencePercent,
    averagePerDayMom.direction,
    labels
  );

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <OverviewCardChrome label={t('analytics.cards.totalSpent')}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.valuePrimary}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {formatMinorAsCurrency(data.overview.total_spent, data.currency)}
          </ThemedText>
        </OverviewCardChrome>
        <OverviewCardChrome label={t('analytics.cards.vsLastMonth')}>
          <View style={styles.comparedBaselineRow}>
            <Text
              style={styles.comparedAmount}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {comparedAmountFormatted}
            </Text>
            <Text
              style={[
                styles.comparedPercent,
                { color: trendDeltaColor(overviewDirection) },
              ]}
            >
              {comparedPercentFormatted}
            </Text>
          </View>
        </OverviewCardChrome>
      </View>
      <View style={styles.row}>
        <OverviewCardChrome label={t('analytics.cards.topCategory')}>
          {biggest == null ? (
            <ThemedText type="defaultSemiBold" style={styles.valueEmpty}>
              —
            </ThemedText>
          ) : (
            <View style={styles.topCategoryBlock}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.valuePrimary}
                numberOfLines={1}
              >
                {biggest.label}
              </ThemedText>
              <ThemedText style={styles.topCategorySubtitle} numberOfLines={1}>
                {t('analytics.percentOfTotal', {
                  percent: formatSharePercentRounded(biggest.percent),
                })}
              </ThemedText>
            </View>
          )}
        </OverviewCardChrome>
        <OverviewCardChrome label={t('analytics.cards.dailyAverage')}>
          <View style={styles.comparedBaselineRow}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.valuePrimary}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {formatMinorAsCurrency(
                data.overview.average_per_day,
                data.currency
              )}
            </ThemedText>
            <Text
              style={[
                styles.comparedPercent,
                { color: trendDeltaColor(averagePerDayMom.direction) },
              ]}
            >
              {averagePerDayPercentFormatted}
            </Text>
          </View>
        </OverviewCardChrome>
      </View>
    </View>
  );
}

const CARD_MIN_HEIGHT = 132;

const styles = StyleSheet.create({
  grid: {
    gap: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: CARD_MIN_HEIGHT,
    paddingVertical: 21,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  cardLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: OVERVIEW_CARD_LABEL_MUTED,
    textTransform: 'uppercase',
    marginBottom: 12,
    maxHeight: 36,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    minHeight: 56,
  },
  valuePrimary: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.35,
    color: OVERVIEW_CARD_VALUE_TEAL,
  },
  valueEmpty: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: Colors.grey,
  },
  comparedBaselineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 10,
  },
  comparedAmount: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.35,
    color: OVERVIEW_CARD_VALUE_TEAL,
    flexShrink: 1,
  },
  comparedPercent: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  topCategoryBlock: {
    gap: 6,
    minWidth: 0,
  },
  topCategorySubtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: Colors.grey,
  },
});
