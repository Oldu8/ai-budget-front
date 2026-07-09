import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

type ScanReviewSummaryCardProps = {
  totalMinor: number;
  itemCount: number;
  currency: string;
};

export function ScanReviewSummaryCard({
  totalMinor,
  itemCount,
  currency,
}: ScanReviewSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <View
      className="mt-6 rounded-2xl bg-brand-primary px-4 py-4"
      style={styles.card}
    >
      <ThemedText
        lightColor={Colors.white}
        style={styles.heading}
        className="text-xs font-medium uppercase tracking-wider"
      >
        {t('add.receiptScan.review.summaryHeading')}
      </ThemedText>
      <View className="mt-2 flex-row justify-between">
        <ThemedText
          lightColor={Colors.white}
          style={styles.label}
          className="text-base"
        >
          {t('add.receiptScan.review.totalLabel')}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          lightColor={Colors.white}
          className="text-base"
        >
          {formatMinorAsCurrency(totalMinor, currency)}
        </ThemedText>
      </View>
      <View className="mt-2 flex-row justify-between">
        <ThemedText
          lightColor={Colors.white}
          style={styles.label}
          className="text-base"
        >
          {t('add.receiptScan.review.itemsCount')}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          lightColor={Colors.white}
          className="text-base"
        >
          {itemCount}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  /** Softened white for secondary text on the primary background. */
  heading: {
    opacity: 0.8,
  },
  label: {
    opacity: 0.85,
  },
});
