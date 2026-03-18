import { ThemedText } from '@/shared/ui/ThemedText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface ExpenseTableHeaderProps {
  days: number[];
}

const CATEGORY_COLUMN_WIDTH = 100;

export function ExpenseTableHeader({ days }: ExpenseTableHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row border-b-2 border-brand-grey bg-brand-white">
      <View
        className="justify-center items-center px-2 py-2 border-r border-brand-grey-hover"
        style={{ width: CATEGORY_COLUMN_WIDTH }}
      >
        <ThemedText className="text-brand-black">
          {t('home.tableCategory')}
        </ThemedText>
      </View>
      {days.map((day) => (
        <View
          key={day}
          className="min-w-[44px] items-center justify-center border-r border-brand-grey-hover py-2 px-1"
        >
          <ThemedText className="text-sm font-medium text-brand-grey">{day}</ThemedText>
        </View>
      ))}
      <View className="min-w-[72px] items-center justify-center border-l-2 border-l-brand-primary border-r border-brand-grey-hover py-2 px-2">
        <ThemedText type="defaultSemiBold" className="text-brand-black">
          {t('home.tableTotal')}
        </ThemedText>
      </View>
    </View>
  );
}
