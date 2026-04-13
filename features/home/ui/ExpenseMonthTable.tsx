import { useHomeStore } from '@/features/home/model/homeStore';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';
import { ExpenseTableCell } from '@/features/home/ui/ExpenseTableCell';
import { ExpenseTableHeader } from '@/features/home/ui/ExpenseTableHeader';
import { ExpenseTableRow } from '@/features/home/ui/ExpenseTableRow';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const CATEGORY_COLUMN_WIDTH = 100;
const DAY_COLUMN_WIDTH = 44;
const TOTAL_COLUMN_WIDTH = 72;

function formatAmount(amount: number): string {
  if (Number.isInteger(amount)) return String(amount);
  return amount.toFixed(2);
}

type ExpenseMonthTableProps = {
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
};

export function ExpenseMonthTable({ refreshing, onRefresh }: ExpenseMonthTableProps) {
  const { t } = useTranslation();
  const { tableData } = useMonthlyExpenseTable();
  const toggleExpanded = useHomeStore((s) => s.toggleExpanded);
  const expandedIds = useHomeStore((s) => s.expandedIds);

  const { days, rows, totalsByDay, grandTotal } = tableData;

  const tableWidth =
    CATEGORY_COLUMN_WIDTH +
    days.length * DAY_COLUMN_WIDTH +
    TOTAL_COLUMN_WIDTH;

  return (
    <View className="flex-1 bg-brand-grey-low">
      {refreshing ? (
        <View style={styles.refreshBanner} pointerEvents="none">
          <ActivityIndicator size="small" color={Colors.primaryHover} />
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        className="flex-1 bg-brand-grey-low"
      >
        <View style={{ minWidth: tableWidth, flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator
            nestedScrollEnabled
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={!!refreshing}
                  onRefresh={() => void onRefresh()}
                  tintColor={Platform.OS === 'ios' ? 'transparent' : undefined}
                  colors={
                    Platform.OS === 'android' ? ['rgba(0,0,0,0)'] : undefined
                  }
                  progressBackgroundColor={
                    Platform.OS === 'android' ? 'transparent' : undefined
                  }
                  progressViewOffset={Platform.OS === 'android' ? 12 : undefined}
                />
              ) : undefined
            }
          >
            <ExpenseTableHeader days={days} />
            {rows.map((row) => (
              <ExpenseTableRow
                key={row.id}
                row={row}
                days={days}
                isExpanded={row.expandable ? expandedIds.has(row.id) : false}
                onToggleExpand={row.expandable ? () => toggleExpanded(row.id) : undefined}
              />
            ))}
            <View className="flex-row border-t-2 border-brand-primary bg-brand-grey-low">
              <View
                className="justify-center items-center px-2 py-2 border-r border-brand-grey-hover"
                style={{ width: CATEGORY_COLUMN_WIDTH }}
              >
                <ThemedText type="defaultSemiBold" className="text-brand-primary">
                  {t('home.tableGrandTotal')}
                </ThemedText>
              </View>
              {days.map((day) => (
                <ExpenseTableCell
                  key={day}
                  amount={totalsByDay[day] ?? 0}
                />
              ))}
              <View className="min-w-[72px] items-end justify-center border-l-2 border-l-brand-primary border-r border-brand-grey-hover py-2 px-2">
                <ThemedText type="defaultSemiBold" className="text-brand-primary">
                  {formatAmount(grandTotal)}
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  refreshBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.greyHover,
    zIndex: 10,
    elevation: 10,
  },
});
