import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { ReceiptScanSuccessScreen } from '@/features/receipt-scan/ui/ReceiptScanSuccessScreen';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';

function goHome() {
  router.replace('/(tabs)' as never);
}

export default function ScanSuccessScreen() {
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');
  const { totalMinor: totalParam, date: dateParam } = useLocalSearchParams<{
    totalMinor?: string;
    date?: string;
  }>();
  const totalMinor =
    totalParam != null && totalParam !== '' ? Number(totalParam) : 0;
  const safeMinor = Number.isFinite(totalMinor) ? totalMinor : 0;
  const dateIso = dateParam != null && dateParam !== '' ? dateParam : '';

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        goHome();
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={['bottom']}>
        <ReceiptScanSuccessScreen
          totalMinor={safeMinor}
          dateIso={dateIso}
          currency={currency}
          onBackHome={goHome}
        />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
