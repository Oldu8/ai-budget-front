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
  const monthYearLabel = format(date, 'MMMM yyyy');

  return (
    <View className="items-center px-4 pt-4 pb-3">
      <ThemedText
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-grey mb-2"
        style={{ letterSpacing: 2 }}
      >
        {t('home.performanceView')}
      </ThemedText>
      <View className="flex-row gap-6 items-center">
        <Pressable
          onPress={setPrevMonth}
          hitSlop={8}
          style={styles.chevronButton}
          accessibilityRole="button"
          accessibilityLabel={t('home.previousMonth')}
        >
          <IconSymbol name="chevron.left" size={22} color={Colors.primary} />
        </Pressable>
        <ThemedText className="text-2xl font-extrabold tracking-tight text-brand-primary">
          {monthYearLabel}
        </ThemedText>
        <Pressable
          onPress={setNextMonth}
          hitSlop={8}
          style={styles.chevronButton}
          accessibilityRole="button"
          accessibilityLabel={t('home.nextMonth')}
        >
          <IconSymbol name="chevron.right" size={22} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chevronButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.greyLow,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
