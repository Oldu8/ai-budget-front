import { usePaidFeatureGate } from '@/features/billing';
import { useSelectedMonth } from '@/features/home/model/useSelectedMonth';
import { Colors } from '@/shared/constants/theme';
import { useDateFnsLocale } from '@/shared/lib/dateFnsLocale';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import { format, isBefore, startOfMonth, subMonths } from 'date-fns';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

export function MonthSwitcher() {
  const { t } = useTranslation();
  const dateLocale = useDateFnsLocale();
  const { requestAccess } = usePaidFeatureGate();
  const { selectedDate, setPrevMonth, setNextMonth } = useSelectedMonth();
  // uk/es month names come lowercase from date-fns; capitalize for the heading.
  const rawMonthYear = format(selectedDate, 'LLLL yyyy', { locale: dateLocale });
  const monthYearLabel =
    rawMonthYear.charAt(0).toUpperCase() + rawMonthYear.slice(1);

  const onPrevMonth = useCallback(() => {
    const targetDate = subMonths(selectedDate, 1);
    const crossesIntoMonthsBeforeCurrent = isBefore(
      startOfMonth(targetDate),
      startOfMonth(new Date())
    );
    const goPrev = () => setPrevMonth();
    if (!crossesIntoMonthsBeforeCurrent) {
      goPrev();
      return;
    }
    requestAccess('pastMonthNavigation', goPrev, {
      title: t('billing.pastMonthUpgradeTitle'),
      reasonText: t('billing.pastMonthUpgradeSubtitle'),
    });
  }, [requestAccess, selectedDate, setPrevMonth, t]);

  return (
    <View className="items-center px-4 pt-3 pb-3">
      <View className="flex-row gap-6 items-center">
        <Pressable
          onPress={onPrevMonth}
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
