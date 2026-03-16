import { getCategoryIcon } from '@/features/home/lib/categoryIcons';
import type { TableRow } from '@/features/home/types';
import { ExpenseTableCell } from '@/features/home/ui/ExpenseTableCell';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import React, { memo } from 'react';
import { Pressable, View } from 'react-native';

const CATEGORY_COLUMN_WIDTH = 100;

interface ExpenseTableRowProps {
  row: TableRow;
  days: number[];
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

export const ExpenseTableRow = memo(function ExpenseTableRow({
  row,
  days,
  isExpanded,
  onToggleExpand,
}: ExpenseTableRowProps) {
  const isExpandable = row.expandable === true;
  const isParent = row.level === 'parent';
  const iconName = getCategoryIcon(row.categorySlug ?? '');

  const categoryCell = (
    <View
      className="flex-row items-center px-2 py-2 border-r border-brand-grey-hover"
      style={{
        width: CATEGORY_COLUMN_WIDTH,
        paddingLeft: row.level === 'child' ? 16 : 8,
      }}
    >
      <View className="flex-1 justify-center items-center">
        {isParent && (
          <IconSymbol name={iconName} size={20} color={Colors.primary} />
        )}
        <ThemedText
          className={`text-center text-xs ${isParent ? 'mt-0.5 font-semibold' : ''}`}
          numberOfLines={2}
        >
          {row.label}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <View className="flex-row bg-brand-white">
      {isExpandable ? (
        <Pressable
          onPress={onToggleExpand}
          style={{ width: CATEGORY_COLUMN_WIDTH }}
        >
          {categoryCell}
        </Pressable>
      ) : (
        categoryCell
      )}
      {days.map((day) => (
        <ExpenseTableCell key={day} amount={row.amountsByDay[day] ?? 0} />
      ))}
      <ExpenseTableCell amount={row.total} isTotalColumn />
    </View>
  );
});
