import React, { memo } from 'react';
import { Text, View } from 'react-native';

import {
  DAY_COLUMN_WIDTH,
  ROW_HEIGHT,
  TOTAL_COLUMN_WIDTH,
} from '@/features/home/ui/expenseTableConstants';
import { Colors } from '@/shared/constants/theme';
import { formatCompactMinorAmount } from '@/shared/utils/formatCompactMinorAmount';

interface ExpenseTableCellProps {
  /** Amount in minor units (cents) */
  amount: number;
  isTotalColumn?: boolean;
  /** When parent row is expanded, day amounts use primary emphasis. */
  tone?: 'default' | 'primary';
  /** Subcategory row: slightly lighter than parent category total. */
  isChildRow?: boolean;
}

const numeralTextStyle = {
  fontVariant: ['tabular-nums' as const],
  fontFeatureSettings: "'tnum'",
};

export const ExpenseTableCell = memo(function ExpenseTableCell({
  amount,
  isTotalColumn,
  tone = 'default',
  isChildRow = false,
}: ExpenseTableCellProps) {
  const w = isTotalColumn ? TOTAL_COLUMN_WIDTH : DAY_COLUMN_WIDTH;

  const baseStyle = {
    width: w,
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderRightWidth: isTotalColumn ? 0 : 1,
    borderLeftWidth: isTotalColumn ? 1 : 0,
    borderColor: Colors.greyHover,
    borderLeftColor: Colors.primary,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (amount <= 0) {
    return <View style={baseStyle} />;
  }

  const displayValue = formatCompactMinorAmount(amount);

  const textColor =
    isTotalColumn || tone === 'primary' ? Colors.primary : Colors.black;
  const fontWeight: '400' | '500' | '600' | '700' = (() => {
    if (isTotalColumn) {
      return isChildRow ? '600' : '700';
    }
    return tone === 'primary' ? '700' : '400';
  })();

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
          alignSelf: 'stretch',
          maxWidth: w - 6,
          ...numeralTextStyle,
        }}
      >
        {displayValue}
      </Text>
    </View>
  );
});
