import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';
import { useReceiptScanPendingImageStore } from '@/features/receipt-scan/model/useReceiptScanPendingImageStore';
import { ReceiptSourceSheet } from '@/features/receipt-scan/ui/ReceiptSourceSheet';
import { ScanUsageCapsule } from '@/features/receipt-scan/ui/ScanUsageCapsule';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

export default function AddScreen() {
  const { t } = useTranslation();
  const { scanUsage } = useAuthContext();
  const scansRemaining = scanUsage?.scans_remaining ?? 0;
  const scansLimit = scanUsage?.scans_limit ?? 0;
  const setPendingImage = useReceiptScanPendingImageStore(
    (s) => s.setPendingImage
  );

  const onImageSelected = useCallback(
    (image: NormalizedReceiptImage) => {
      setPendingImage(image);
      router.push('/(add)/scan' as never);
    },
    [setPendingImage]
  );

  return (
    <ThemedView className="flex-1 bg-brand-grey-low">
      <View className="items-end px-4 pt-1">
        <ScanUsageCapsule scansRemaining={scansRemaining} scansLimit={scansLimit} />
      </View>
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
            />
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
