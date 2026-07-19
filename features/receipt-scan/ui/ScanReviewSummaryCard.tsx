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
  /** Receipt currency when it differs from the account currency — enables the original-total and rate rows. */
  originalCurrency?: string | null;
  /** Receipt total in originalCurrency minor units, frozen at scan time. */
  originalTotalMinor?: number | null;
  /** Conversion rate: account amount = receipt amount × rate. */
  exchangeRate?: number | null;
};

/** Rates vary in magnitude (0.02 … 45.6), so keep up to 4 decimals but drop trailing zeros. */
function formatRate(rate: number): string {
  return String(Number(rate.toFixed(4)));
}

export function ScanReviewSummaryCard({
  totalMinor,
  itemCount,
  currency,
  originalCurrency,
  originalTotalMinor,
  exchangeRate,
}: ScanReviewSummaryCardProps) {
  const { t } = useTranslation();

  const showOriginal = originalCurrency != null && originalTotalMinor != null;

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
      {showOriginal ? (
        <View className="mt-1 flex-row justify-between">
          <ThemedText
            lightColor={Colors.white}
            style={styles.secondary}
            className="text-sm"
          >
            {t('add.receiptScan.review.receiptTotalLabel')}
          </ThemedText>
          <ThemedText
            lightColor={Colors.white}
            style={styles.secondary}
            className="text-sm"
          >
            {formatMinorAsCurrency(originalTotalMinor, originalCurrency)}
          </ThemedText>
        </View>
      ) : null}
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
      {showOriginal && exchangeRate != null ? (
        <View className="mt-2 flex-row justify-between">
          <ThemedText
            lightColor={Colors.white}
            style={styles.secondary}
            className="text-sm"
          >
            {t('add.receiptScan.review.rateLabel')}
          </ThemedText>
          <ThemedText
            lightColor={Colors.white}
            style={styles.secondary}
            className="text-sm"
          >
            {`1 ${originalCurrency.toUpperCase()} ≈ ${formatRate(exchangeRate)} ${currency.toUpperCase()}`}
          </ThemedText>
        </View>
      ) : null}
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
  /** Receipt-currency total and rate: quieter than the converted total. */
  secondary: {
    opacity: 0.7,
  },
});
