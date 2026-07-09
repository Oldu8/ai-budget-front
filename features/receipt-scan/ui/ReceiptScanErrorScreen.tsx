import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { receiptScanStateTokens } from '@/features/receipt-scan/lib/receiptScanStateTokens';
import { Colors } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/Button';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

type ReceiptScanErrorScreenProps = {
  onTryAgain: () => void;
  /** Specific error text from the failed request; falls back to the generic copy. */
  description?: string;
};

export function ReceiptScanErrorScreen({ onTryAgain, description }: ReceiptScanErrorScreenProps) {
  const { t } = useTranslation();
  const circle = receiptScanStateTokens.iconCircleSize;

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
          name="exclamationmark.triangle.fill"
          size={receiptScanStateTokens.iconInnerSize}
          color={Colors.error}
        />
      </View>

      <ThemedText
        type="title"
        className="mt-6 text-center text-brand-primary"
        style={styles.title}
      >
        {t('add.receiptScan.error.title')}
      </ThemedText>
      <ThemedText
        className="mt-3 text-center text-base text-brand-grey"
        style={styles.description}
      >
        {description || t('add.receiptScan.error.description')}
      </ThemedText>

      <View style={styles.cta}>
        <Button variant="primary" onPress={onTryAgain}>
          {t('add.receiptScan.error.tryAgain')}
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
  cta: {
    marginTop: receiptScanStateTokens.subtitleToBodyGap,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: receiptScanStateTokens.horizontalPadding,
  },
});
