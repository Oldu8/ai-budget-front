import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import {
  CATEGORY_COLUMN_WIDTH,
  DAY_COLUMN_WIDTH,
  HEADER_ROW_HEIGHT,
  TOTAL_COLUMN_WIDTH,
} from '@/features/home/ui/expenseTableConstants';
import { Colors } from '@/shared/constants/theme';

/** Top-left frozen cell: "CATEGORY" label. */
export function ExpenseTableHeaderCorner() {
  const { t } = useTranslation();
  return (
    <View
      style={{
        width: CATEGORY_COLUMN_WIDTH,
        height: HEADER_ROW_HEIGHT,
        backgroundColor: Colors.white,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.greyHover,
        paddingHorizontal: 8,
        justifyContent: 'center',
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: Colors.grey,
        }}
      >
        {t('home.tableCategory')}
      </Text>
    </View>
  );
}

/** Single day column header — just the day number (no weekday letter). */
export function ExpenseTableHeaderDayCell({ day }: { day: number }) {
  return (
    <View
      style={{
        width: DAY_COLUMN_WIDTH,
        height: HEADER_ROW_HEIGHT,
        backgroundColor: Colors.white,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.greyHover,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: Colors.primary,
        }}
      >
        {day}
      </Text>
    </View>
  );
}

/** Total column header (TOTAL + month abbr). */
export function ExpenseTableHeaderTotalCell({
  monthAbbr,
}: {
  monthAbbr: string;
}) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        width: TOTAL_COLUMN_WIDTH,
        height: HEADER_ROW_HEIGHT,
        backgroundColor: Colors.greyHover,
        borderBottomWidth: 1,
        borderColor: Colors.greyHover,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 8,
          fontWeight: '700',
          textTransform: 'uppercase',
          color: Colors.primary,
        }}
      >
        {t('home.tableTotal')}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: '700',
          color: Colors.primary,
        }}
      >
        {monthAbbr}
      </Text>
    </View>
  );
}
