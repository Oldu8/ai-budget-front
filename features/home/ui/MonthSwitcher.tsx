import { usePaidFeatureGate } from '@/features/billing';
import { useSelectedMonth } from '@/features/home/model/useSelectedMonth';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

export function MonthSwitcher() {
  const { t } = useTranslation();
  const { requestAccess } = usePaidFeatureGate();
  const { year, month, setPrevMonth, setNextMonth } = useSelectedMonth();
  const date = new Date(year, month - 1);
  const monthYearLabel = format(date, 'MMMM yyyy');

  const onPrevMonth = useCallback(() => {
    requestAccess(
      'pastMonthNavigation',
      setPrevMonth,
      {
        title: t('billing.pastMonthUpgradeTitle'),
        reasonText: t('billing.pastMonthUpgradeSubtitle'),
      }
    );
  }, [requestAccess, setPrevMonth, t]);

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
