import type { Locale } from 'date-fns';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import type { RecurringExpense } from '@/features/recurring-expenses/types';
import { Colors } from '@/shared/constants/theme';
import { useDateFnsLocale } from '@/shared/lib/dateFnsLocale';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { ThemedText } from '@/shared/ui/ThemedText';

interface RecurringExpenseListItemProps {
  expense: RecurringExpense;
  title: string;
  onPress: () => void;
}

function formatNextRun(raw: string | null, locale: Locale): string {
  if (!raw) return '—';
  try {
    const d = parseISO(raw);
    if (Number.isNaN(d.getTime())) return '—';
    return format(d, 'MMM d, yyyy', { locale });
  } catch {
    return '—';
  }
}

export function RecurringExpenseListItem({
  expense,
  title,
  onPress,
}: RecurringExpenseListItemProps) {
  const { t } = useTranslation();
  const dateLocale = useDateFnsLocale();
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');

  const scheduleLine = t(`recurring.frequency.${expense.frequency}`);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}
      >
        <View>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
            {title}
          </ThemedText>
          <ThemedText style={styles.amount}>
            {formatMinorAsCurrency(expense.amount, currency)}
          </ThemedText>
          <ThemedText style={styles.meta} numberOfLines={2}>
            {scheduleLine}
          </ThemedText>
          <ThemedText style={styles.meta}>
            {t('recurring.listNext')} {formatNextRun(expense.next_run_at, dateLocale)}
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    marginBottom: 12,
    padding: 8,
  },
  cardPressable: {
    padding: 16,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  title: {
    fontSize: 16,
    color: Colors.black,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 6,
  },
  meta: {
    fontSize: 13,
    color: Colors.grey,
    marginTop: 4,
  },
});
