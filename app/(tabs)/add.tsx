import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

export default function AddScreen() {
  const { t } = useTranslation();

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
          <Pressable
            className="h-40 w-40 items-center justify-center rounded-2xl bg-brand-primary shadow-md"
            style={{ shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 }}
          >
            <IconSymbol name="camera.fill" size={48} color={Colors.white} />
            <ThemedText className="mt-3 text-base font-semibold" style={{ color: Colors.white }}>
              {t('add.scanReceipt')}
            </ThemedText>
          </Pressable>

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
