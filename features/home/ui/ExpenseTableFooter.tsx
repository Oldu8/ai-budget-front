import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import {
  CATEGORY_COLUMN_WIDTH,
  DAY_COLUMN_WIDTH,
  TOTAL_COLUMN_WIDTH,
  TOTAL_ROW_HEIGHT,
} from '@/features/home/ui/expenseTableConstants';
import { Colors } from '@/shared/constants/theme';

const MAX_DAY_CHARS = 6;
const MAX_TOTAL_CHARS = 8;

function formatAmount(amount: number): string {
  if (Number.isInteger(amount)) return String(amount);
  return amount.toFixed(2);
}

/** Left label cell of the daily-total row. */
export function ExpenseTableFooterCorner() {
  const { t } = useTranslation();
  return (
    <View
      style={{
        width: CATEGORY_COLUMN_WIDTH,
        height: TOTAL_ROW_HEIGHT,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: Colors.white,
        }}
      >
        {t('home.tableDailyTotal')}
      </Text>
    </View>
  );
}

/** Single day total cell in the footer row. */
export function ExpenseTableFooterDayCell({ amount }: { amount: number }) {
  const display = formatAmount(amount).slice(0, MAX_DAY_CHARS);
  return (
    <View
      style={{
        width: DAY_COLUMN_WIDTH,
        height: TOTAL_ROW_HEIGHT,
        backgroundColor: Colors.primary,
        borderRightWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={{ fontSize: 11, fontWeight: '700', color: Colors.white }}
      >
        {display}
      </Text>
    </View>
  );
}

/** Grand total cell (right-most in the footer). */
export function ExpenseTableFooterGrandTotalCell({
  amount,
}: {
  amount: number;
}) {
  const display = formatAmount(amount).slice(0, MAX_TOTAL_CHARS);
  return (
    <View
      style={{
        width: TOTAL_COLUMN_WIDTH,
        height: TOTAL_ROW_HEIGHT,
        backgroundColor: Colors.primary,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={{ fontSize: 12, fontWeight: '800', color: Colors.white }}
      >
        {display}
      </Text>
    </View>
  );
}
