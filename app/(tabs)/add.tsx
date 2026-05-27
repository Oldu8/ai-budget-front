import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useBillingActions } from '@/features/billing';
import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';
import { useReceiptScanPendingImageStore } from '@/features/receipt-scan/model/useReceiptScanPendingImageStore';
import { ReceiptSourceSheet } from '@/features/receipt-scan/ui/ReceiptSourceSheet';
import { ScanReceiptTips } from '@/features/receipt-scan/ui/ScanReceiptTips';
import { ScanUsageCapsule } from '@/features/receipt-scan/ui/ScanUsageCapsule';
import { RecurringEntryButton } from '@/features/recurring-expenses';
import { VoiceExpenseEntryButton } from '@/features/voice-expense';
import { AddEntryOptionCard } from '@/shared/ui/AddEntryOptionCard';
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center">
          <View className="relative w-full">
            <ReceiptSourceSheet
              variant="primaryCard"
              isLocked={scansRemaining <= 0}
              onLockedPress={handleLockedPress}
              onImageSelected={onImageSelected}
            />
            <ScanReceiptTips />
          </View>

          <View className="flex-row gap-3 items-center mt-4">
            <View className="flex-1 h-px bg-brand-grey" />
            <ThemedText className="text-sm text-brand-grey">{t('add.or')}</ThemedText>
            <View className="flex-1 h-px bg-brand-grey" />
          </View>

          <View className="mt-4 w-full">
            <AddEntryOptionCard
              title={t('add.addManually')}
              subtitle={t('add.addManuallySubtitle')}
              onPress={() => router.push('/(add)/manual' as never)}
            />
          </View>
        </View>

        <View className="mt-4">
          <RecurringEntryButton
            onGrantedNavigate={() => router.push('/(recurring)' as never)}
          />
        </View>

        <View className="mt-4">
          <VoiceExpenseEntryButton
            onGrantedNavigate={() =>
              router.push('/(add)/voice' as never)
            }
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
});
