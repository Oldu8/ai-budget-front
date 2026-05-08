import {
  formatDiffPercent,
  formatSignedMinorCurrency,
} from '@/features/analytics/lib/formatAnalytics';
import {
  type AnalyticsDirection,
  type AnalyticsTrendCategory,
} from '@/features/analytics/model/types';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

type TrendsListProps = {
  trends: AnalyticsTrendCategory[];
  currency: string;
};

function trendPercentColor(direction: AnalyticsDirection): string {
  if (direction === 'down') {
    return Colors.error;
  }
  if (direction === 'up') {
    return '#15803d';
  }
  return Colors.grey;
}

function DirectionIcon({ direction }: { direction: AnalyticsDirection }) {
  if (direction === 'up') {
    return <MaterialIcons name="arrow-upward" size={18} color={Colors.primary} />;
  }
  if (direction === 'down') {
    return <MaterialIcons name="arrow-downward" size={18} color={Colors.error} />;
  }
  return <MaterialIcons name="remove" size={18} color={Colors.grey} />;
}

export function TrendsList({ trends, currency }: TrendsListProps) {
  const { t } = useTranslation();
  const labels = useMemo(() => ({ newLabel: t('analytics.new') }), [t]);

  return (
    <View style={styles.list}>
      {trends.map((row) => (
        <ThemedView key={`${row.id}-${row.slug}`} style={styles.row}>
          <View style={styles.rowMain}>
            <ThemedText type="defaultSemiBold" style={styles.label} numberOfLines={2}>
              {row.label}
            </ThemedText>
            <View style={styles.metrics}>
              <ThemedText style={styles.amount}>
                {formatSignedMinorCurrency(row.direction, row.difference_amount, currency)}
              </ThemedText>
              <ThemedText
                style={[
                  styles.percent,
                  { color: trendPercentColor(row.direction) },
                ]}
              >
                {formatDiffPercent(row.difference_percent, row.direction, labels)}
              </ThemedText>
            </View>
          </View>
          <DirectionIcon direction={row.direction} />
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    backgroundColor: Colors.white,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  amount: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '600',
  },
  percent: {
    fontSize: 13,
  },
});
