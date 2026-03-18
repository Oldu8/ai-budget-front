import { useSelectedMonth } from '@/features/home/model/useSelectedMonth';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

export function MonthSwitcher() {
  const { t } = useTranslation();
  const { year, month, setPrevMonth, setNextMonth } = useSelectedMonth();
  const date = new Date(year, month - 1);
  const monthLabel = format(date, 'MMMM');
  const yearLabel = format(date, 'yyyy');

  return (
    <View className="flex-row gap-2 justify-between items-center px-4 py-3 bg-brand-white">
      <Pressable
        onPress={setPrevMonth}
        hitSlop={8}
        style={styles.chevronButton}
        accessibilityRole="button"
        accessibilityLabel={t('home.previousMonth')}
      >
        <IconSymbol name="chevron.left" size={20} color={Colors.black} />
      </Pressable>
      <View className="items-center">
        <ThemedText className="text-sm text-brand-grey mt-0.5">
          {yearLabel}
        </ThemedText>
        <ThemedText className="text-xl font-bold text-brand-black">
          {monthLabel}
        </ThemedText>
      </View>
      <Pressable
        onPress={setNextMonth}
        hitSlop={8}
        style={styles.chevronButton}
        accessibilityRole="button"
        accessibilityLabel={t('home.nextMonth')}
      >
        <IconSymbol name="chevron.right" size={20} color={Colors.black} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chevronButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.greyLow,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    color: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
