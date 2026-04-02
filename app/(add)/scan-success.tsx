import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, StyleSheet, View } from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

function goHome() {
  router.replace('/(tabs)' as never);
}

export default function ScanSuccessScreen() {
  const { t } = useTranslation();
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');
  const { totalMinor: totalParam } = useLocalSearchParams<{
    totalMinor?: string;
  }>();
  const totalMinor =
    totalParam != null && totalParam !== '' ? Number(totalParam) : 0;
  const safeMinor = Number.isFinite(totalMinor) ? totalMinor : 0;

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
        <View className="flex-1 justify-center px-6">
          <ThemedText type="title" className="text-center text-brand-primary">
            {t('add.receiptScan.success.title')}
          </ThemedText>
          <View className="mt-8 items-center">
            <ThemedText className="text-base text-brand-grey">
              {t('add.receiptScan.success.totalLabel')}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              className="mt-2 text-center text-2xl"
            >
              {formatMinorAsCurrency(safeMinor, currency)}
            </ThemedText>
          </View>
          <View className="mt-12">
            <Button variant="primary" onPress={goHome}>
              {t('add.receiptScan.success.home')}
            </Button>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
