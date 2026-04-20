import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useBillingActions } from '@/features/billing';
import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';
import { useReceiptScanPendingImageStore } from '@/features/receipt-scan/model/useReceiptScanPendingImageStore';
import { ReceiptSourceSheet } from '@/features/receipt-scan/ui/ReceiptSourceSheet';
import { ScanUsageCapsule } from '@/features/receipt-scan/ui/ScanUsageCapsule';
import { RecurringEntryButton } from '@/features/recurring-expenses';
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

          <View style={styles.manualCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('add.addManually')}
              onPress={() => router.push('/(add)/manual' as never)}
              style={({ pressed }) => [
                styles.manualPressable,
                pressed && styles.manualPressed,
              ]}
            >
              <ThemedText type="defaultSemiBold" style={styles.manualLabel}>
                {t('add.addManually')}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View className="mt-10">
          <RecurringEntryButton
            onGrantedNavigate={() => router.push('/(recurring)' as never)}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  /** Только StyleSheet — без className на этой ноде: на нативе смесь className+style даёт «пустую» карточку. */
  manualCard: {
    marginTop: 40,
    width: '100%',
    alignSelf: 'stretch',
    padding: 16,
    backgroundColor: Colors.white,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      },
    }),
  },
  manualPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  manualPressed: {
    opacity: 0.92,
  },
  /** ThemedText не прокидывает tailwind className так же, как веб — цвет и вес явно. */
  manualLabel: {
    color: Colors.primary,
    textAlign: 'center',
  },
});
