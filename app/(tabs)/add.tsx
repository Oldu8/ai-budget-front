import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';
import { useScanReceiptMutation } from '@/features/receipt-scan/model/useScanReceiptMutation';
import { ReceiptSourceSheet } from '@/features/receipt-scan/ui/ReceiptSourceSheet';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

export default function AddScreen() {
  const { t } = useTranslation();
  const { mutate, isPending } = useScanReceiptMutation();

  const onImageSelected = useCallback(
    (image: NormalizedReceiptImage) => {
      mutate(image);
    },
    [mutate]
  );

  return (
    <ThemedView className="flex-1 bg-brand-grey-low">
      <View className="flex-1 justify-center px-6">
        <ThemedText type="title" className="text-center text-brand-primary">
          {t('add.addExpense')}
        </ThemedText>
        <ThemedText className="mt-2 text-center text-base text-brand-grey">
          {t('add.subtitle')}
        </ThemedText>

        <View className="mt-10 items-center">
          <View className="relative w-full max-w-xs">
            <ReceiptSourceSheet
              variant="primaryCard"
              onImageSelected={onImageSelected}
              disabled={isPending}
            />
            {isPending ? (
              <View style={styles.overlay} pointerEvents="auto">
                <View style={styles.overlayInner}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <ThemedText className="mt-4 text-center text-base text-brand-primary">
                    {t('add.receiptScan.scanning')}
                  </ThemedText>
                </View>
              </View>
            ) : null}
          </View>

          <View className="mt-10 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-brand-grey" />
            <ThemedText className="text-sm text-brand-grey">{t('add.or')}</ThemedText>
            <View className="h-px flex-1 bg-brand-grey" />
          </View>

          <Pressable
            className="mt-10 w-full items-center justify-center rounded-xl py-4"
            style={{ backgroundColor: Colors.greyLow }}
            onPress={() => router.push('/(add)/manual' as never)}
            disabled={isPending}
          >
            <ThemedText className="text-base font-semibold text-brand-primary">
              {t('add.addManually')}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  overlayInner: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});
