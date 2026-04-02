import type { Locale } from 'date-fns';
import { format, parseISO } from 'date-fns';
import { enUS, es, uk as ukLocale } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { receiptScanStateTokens } from '@/features/receipt-scan/lib/receiptScanStateTokens';
import { Colors } from '@/shared/constants/theme';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { Button } from '@/shared/ui/Button';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

const DATE_FNS_LOCALES: Record<string, Locale> = {
  en: enUS,
  es,
  uk: ukLocale,
};

type ReceiptScanSuccessScreenProps = {
  totalMinor: number;
  dateIso: string;
  currency: string;
  onBackHome: () => void;
};

export function ReceiptScanSuccessScreen({
  totalMinor,
  dateIso,
  currency,
  onBackHome,
}: ReceiptScanSuccessScreenProps) {
  const { t, i18n } = useTranslation();
  const circle = receiptScanStateTokens.iconCircleSize;

  const dateLocale = useMemo(() => {
    const code = i18n.language.split(/[-_]/)[0] ?? 'en';
    return DATE_FNS_LOCALES[code] ?? enUS;
  }, [i18n.language]);

  const dateLine = useMemo(() => {
    try {
      const d = parseISO(dateIso);
      if (Number.isNaN(d.getTime())) return dateIso;
      return format(d, 'MMM d, yyyy', { locale: dateLocale });
    } catch {
      return dateIso;
    }
  }, [dateIso, dateLocale]);

  const safeMinor = Number.isFinite(totalMinor) ? totalMinor : 0;

  return (
    <View style={styles.center}>
      <View
        style={[
          styles.iconCircle,
          {
            width: circle,
            height: circle,
            borderRadius: circle / 2,
          },
        ]}
      >
        <IconSymbol
          name="checkmark.circle.fill"
          size={receiptScanStateTokens.iconInnerSize}
          color={Colors.primary}
        />
      </View>

      <ThemedText
        type="title"
        className="mt-6 text-center text-brand-primary"
        style={styles.title}
      >
        {t('add.receiptScan.success.title')}
      </ThemedText>
      <ThemedText
        className="mt-3 text-center text-base text-brand-grey"
        style={styles.description}
      >
        {t('add.receiptScan.success.description')}
      </ThemedText>

      <View
        style={[
          styles.card,
          {
            borderRadius: receiptScanStateTokens.cardRadius,
            padding: receiptScanStateTokens.cardPadding,
          },
        ]}
      >
        <View style={styles.row}>
          <ThemedText className="text-base text-brand-grey">
            {t('add.receiptScan.success.totalLabel')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" className="text-base">
            {formatMinorAsCurrency(safeMinor, currency)}
          </ThemedText>
        </View>
        <View style={[styles.row, styles.rowSecond]}>
          <ThemedText className="text-base text-brand-grey">
            {t('add.receiptScan.success.dateLabel')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" className="text-base">
            {dateLine}
          </ThemedText>
        </View>
      </View>

      <View style={styles.cta}>
        <Button variant="primary" onPress={onBackHome}>
          {t('add.receiptScan.success.backHome')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyLow,
  },
  title: {
    paddingHorizontal: receiptScanStateTokens.horizontalPadding,
  },
  description: {
    paddingHorizontal: receiptScanStateTokens.horizontalPadding,
  },
  card: {
    marginTop: receiptScanStateTokens.subtitleToBodyGap,
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSecond: {
    marginTop: 10,
  },
  cta: {
    marginTop: receiptScanStateTokens.subtitleToBodyGap,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: receiptScanStateTokens.horizontalPadding,
  },
});
