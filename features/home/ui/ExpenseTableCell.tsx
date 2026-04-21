import React, { memo } from 'react';
import { Text, View } from 'react-native';

import {
  DAY_COLUMN_WIDTH,
  ROW_HEIGHT,
  TOTAL_COLUMN_WIDTH,
} from '@/features/home/ui/expenseTableConstants';
import { Colors } from '@/shared/constants/theme';

interface ExpenseTableCellProps {
  amount: number;
  isTotalColumn?: boolean;
  /** When parent row is expanded, amounts use primary emphasis. */
  tone?: 'default' | 'primary';
}

/** Temporary crude cap until a proper abbreviation formatter exists. */
const MAX_DAY_CHARS = 6;
const MAX_TOTAL_CHARS = 8;

function formatAmount(amount: number): string {
  if (Number.isInteger(amount)) return String(amount);
  return amount.toFixed(2);
}

const TOTAL_COLUMN_TINT = 'rgba(0, 84, 81, 0.06)';

export const ExpenseTableCell = memo(function ExpenseTableCell({
  amount,
  isTotalColumn,
  tone = 'default',
}: ExpenseTableCellProps) {
  const w = isTotalColumn ? TOTAL_COLUMN_WIDTH : DAY_COLUMN_WIDTH;

  const baseStyle = {
    width: w,
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderRightWidth: isTotalColumn ? 0 : 1,
    borderLeftWidth: isTotalColumn ? 2 : 0,
    borderColor: Colors.greyHover,
    borderLeftColor: Colors.primary,
    backgroundColor: isTotalColumn ? TOTAL_COLUMN_TINT : 'transparent',
    paddingHorizontal: 4,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (amount <= 0) {
    return <View style={baseStyle} />;
  }

  const displayValue = formatAmount(amount);
  const capped = isTotalColumn
    ? displayValue.slice(0, MAX_TOTAL_CHARS)
    : displayValue.slice(0, MAX_DAY_CHARS);

  const textColor = tone === 'primary' ? Colors.primary : Colors.black;
  const fontWeight: '400' | '700' =
    tone === 'primary' || isTotalColumn ? '700' : '400';

  return (
    <View style={baseStyle}>
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={{
          fontSize: 11,
          fontWeight,
          color: textColor,
          textAlign: 'center',
          maxWidth: w - 6,
        }}
      >
        {capped}
      </Text>
    </View>
  );
});
