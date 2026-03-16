import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import React, { memo } from 'react';
import { View } from 'react-native';

interface ExpenseTableCellProps {
  amount: number;
  isTotalColumn?: boolean;
}

const DOT_SIZE = 6;

function formatAmount(amount: number): string {
  if (Number.isInteger(amount)) return String(amount);
  return amount.toFixed(2);
}

export const ExpenseTableCell = memo(function ExpenseTableCell({
  amount,
  isTotalColumn,
}: ExpenseTableCellProps) {
  if (amount <= 0) {
    return (
      <View
        className={`min-w-[44px] items-end justify-center border-b border-r border-brand-grey-hover py-2 px-1 ${isTotalColumn ? 'border-l-2 border-l-brand-primary min-w-[72px]' : ''}`}
      />
    );
  }

  const displayValue = formatAmount(amount);

  return (
    <View
      className={`min-w-[44px] flex items-center justify-end gap-1 border-b border-r border-brand-grey-hover py-2 px-1 ${isTotalColumn ? 'border-l-2 border-l-brand-primary min-w-[72px]' : ''}`}
    >
      <View
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: Colors.primary,
        }}
      />
      <ThemedText className="text-sm" numberOfLines={1}>
        {displayValue}
      </ThemedText>
    </View>
  );
});
