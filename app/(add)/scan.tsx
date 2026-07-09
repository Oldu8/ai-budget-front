import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { getScanErrorToastText } from '@/features/receipt-scan/lib/getScanErrorToastText';
import { useReceiptScanPendingImageStore } from '@/features/receipt-scan/model/useReceiptScanPendingImageStore';
import { useScanReceiptMutation } from '@/features/receipt-scan/model/useScanReceiptMutation';
import { ReceiptScanErrorScreen } from '@/features/receipt-scan/ui/ReceiptScanErrorScreen';
import { ReceiptScanLoadingScreen } from '@/features/receipt-scan/ui/ReceiptScanLoadingScreen';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';

export default function ScanScreen() {
  const { t } = useTranslation();
  const { mutate, reset, isError, isSuccess, error } = useScanReceiptMutation();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    const img = useReceiptScanPendingImageStore.getState().pendingImage;
    if (!img) {
      router.replace('/(tabs)/add' as never);
      return;
    }
    startedRef.current = true;
    mutate(img, {
      onSettled: () => {
        useReceiptScanPendingImageStore.getState().clear();
      },
    });
  }, [mutate]);

  const onTryAgain = () => {
    reset();
    router.replace('/(tabs)/add' as never);
  };

  if (isSuccess) {
    return null;
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <ScreenContainer variant="default" edges={['bottom']}>
          <ReceiptScanErrorScreen
            onTryAgain={onTryAgain}
            description={getScanErrorToastText(error, t)}
          />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={['bottom']}>
        <ReceiptScanLoadingScreen />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
