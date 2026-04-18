import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { UpgradePromoCard, useBillingActions } from '@/features/billing';
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
  const { openPaywall } = useBillingActions();
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

  const handleLockedPress = useCallback(() => {
    openPaywall({
      title: t('billing.scanLimitReached', 'Scan limit reached'),
      message: t(
        'billing.scanLimitReachedMessage',
        'Upgrade your plan to unlock more AI scans this month.'
      ),
    });
  }, [openPaywall, t]);

  return (
    <ThemedView className="flex-1 bg-brand-grey-low">
      <View className="items-end px-4 pt-1">
        <ScanUsageCapsule scansRemaining={scansRemaining} scansLimit={scansLimit} />
      </View>
      <View className="flex-1 justify-center px-6">
        <View className="items-center mt-10">
          <View className="relative w-full max-w-xs">
            <ReceiptSourceSheet
              variant="primaryCard"
              isLocked={scansRemaining <= 0}
              onLockedPress={handleLockedPress}
              onImageSelected={onImageSelected}
            />
          </View>

          <View className="flex-row gap-3 items-center mt-10">
            <View className="flex-1 h-px bg-brand-grey" />
            <ThemedText className="text-sm text-brand-grey">{t('add.or')}</ThemedText>
            <View className="flex-1 h-px bg-brand-grey" />
          </View>

          <Pressable
            className="justify-center items-center py-4 mt-10 w-full rounded-xl"
            style={{ backgroundColor: Colors.greyLow }}
            onPress={() => router.push('/(add)/manual' as never)}
          >
            <ThemedText className="text-base font-semibold text-brand-primary">
              {t('add.addManually')}
            </ThemedText>
          </Pressable>
        </View>

        <View className="mt-10">
          <UpgradePromoCard
            title={t('billing.addPromoTitle', 'Upgrade for unlimited tools')}
            subtitle={t(
              'billing.addPromoSubtitle',
              'Unlock recurring expenses, CSV export, and higher scan limits.'
            )}
            ctaLabel={t('billing.viewPlans', 'View plans')}
            onPress={() =>
              openPaywall({
                title: t('billing.upgradeTitle', 'Unlock premium features'),
                message: t(
                  'billing.upgradeMessage',
                  'Choose Basic, Plus, or Premium to keep everything running.'
                ),
              })
            }
          />
        </View>
      </View>
    </ThemedView>
  );
}
