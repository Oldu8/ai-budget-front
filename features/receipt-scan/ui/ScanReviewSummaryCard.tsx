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
    <View className="mt-6 rounded-2xl bg-white px-4 py-4" style={styles.card}>
      <ThemedText className="text-xs font-medium uppercase tracking-wider text-brand-grey">
        {t('add.receiptScan.review.summaryHeading')}
      </ThemedText>
      <View className="mt-2 flex-row justify-between">
        <ThemedText className="text-base text-brand-grey">
          {t('add.receiptScan.review.totalLabel')}
        </ThemedText>
        <ThemedText type="defaultSemiBold" className="text-base">
          {formatMinorAsCurrency(totalMinor, currency)}
        </ThemedText>
      </View>
      <View className="mt-2 flex-row justify-between">
        <ThemedText className="text-base text-brand-grey">
          {t('add.receiptScan.review.itemsCount')}
        </ThemedText>
        <ThemedText type="defaultSemiBold" className="text-base">
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
});
