import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/shared/ui/ThemedText';

export function EmptyExpensesState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <ThemedText type="subtitle" className="text-center text-brand-black">
        {t('home.emptyTitle')}
      </ThemedText>
      <ThemedText className="mt-2 text-center text-brand-grey">
        {t('home.emptyDescription')}
      </ThemedText>
    </View>
  );
}
