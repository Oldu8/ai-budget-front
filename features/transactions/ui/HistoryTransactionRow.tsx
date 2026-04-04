import { format, isMatch, isValid, parseISO } from 'date-fns';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { TransactionListItem } from '@/features/transactions/types';
import { Colors } from '@/shared/constants/theme';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { ThemedText } from '@/shared/ui/ThemedText';

type HistoryTransactionRowProps = {
  transaction: TransactionListItem;
  currency: string;
};

/** Unique category names from all line items, in first-seen order. */
function primaryLabel(tx: TransactionListItem): string {
  const items = tx.items;
  if (!items?.length) return 'Expense';

  const seen = new Set<string>();
  const labels: string[] = [];
  for (const item of items) {
    const cat =
      item.category?.label;
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      labels.push(cat);
    }
  }
  return labels.join(', ');
}

/** Show clock time only when the API string encodes a real time (not date-only / UTC midnight placeholders). */
function timeLineFromDateString(dateStr: string): string | null {
  const s = dateStr.trim();
  if (!s) return null;
  if (isMatch(s, 'yyyy-MM-dd')) return null;

  const d = parseISO(s);
  if (!isValid(d)) return null;

  // Skip common "date only" encoding as ISO instant at 00:00:00.000 UTC
  if (
    s.includes('T') &&
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  ) {
    return null;
  }

  return format(d, 'HH:mm');
}

export function HistoryTransactionRow({
  transaction,
  currency,
}: HistoryTransactionRowProps) {
  const timeLine = useMemo(
    () => timeLineFromDateString(transaction.date),
    [transaction.date],
  );

  const category = primaryLabel(transaction);
  return (
    <Pressable
      onPress={() =>
        router.push(`/(tabs)/history/${transaction.id}` as never)
      }
      style={styles.row}
    >
      <View className="flex-col flex-1 justify-center pr-3 min-w-0">
        <ThemedText
          lightColor={Colors.primary}
          className="text-base font-medium leading-snug"
          numberOfLines={2}
        >
          {category}
        </ThemedText>
        {timeLine ? (
          <ThemedText
            lightColor={Colors.grey}
            className="mt-0.5 text-sm leading-normal"
            numberOfLines={1}
          >
            {timeLine}
          </ThemedText>
        ) : null}
      </View>
      <ThemedText
        lightColor={Colors.primary}
        className="text-lg font-bold leading-tight shrink-0"
      >
        {formatMinorAsCurrency(transaction.total_amount, currency)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
