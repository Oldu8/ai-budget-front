import { getCategoryIcon } from '@/features/home/lib/categoryIcons';
import type { TableRow } from '@/features/home/types';
import { ExpenseTableCell } from '@/features/home/ui/ExpenseTableCell';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';

const CATEGORY_COLUMN_WIDTH = 100;
const TOOLTIP_DURATION_MS = 3000;

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
  const { t } = useTranslation();
  const isExpandable = row.expandable === true;
  const isParent = row.level === 'parent';
  const iconName = getCategoryIcon(row.categorySlug ?? '');
  const rawLabel = row.categorySlug
    ? t(`categories.${row.categorySlug}`, { defaultValue: row.label })
    : row.label;
  const label = rawLabel.length > 12 ? `${rawLabel.slice(0, 12)}…` : rawLabel;
  const isTruncated = rawLabel.length > 12;

  const isChild = row.level === 'child';
  const categoryCellBg = isChild ? 'bg-brand-white' : 'bg-brand-grey-low';
  const rowBg = isChild ? 'bg-brand-white' : 'bg-brand-grey-low';

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipLayout, setTooltipLayout] = useState({ x: 0, y: 0 });
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cellRef = useRef<View>(null);

  const showTooltip = useCallback(() => {
    if (!isChild || !isTruncated) return;
    cellRef.current?.measureInWindow((x, y, width) => {
      setTooltipLayout({
        x: x + Math.max(0, (width - 200) / 2),
        y,
      });
      setTooltipVisible(true);
      tooltipTimerRef.current = setTimeout(() => {
        setTooltipVisible(false);
        tooltipTimerRef.current = null;
      }, TOOLTIP_DURATION_MS);
    });
  }, [isChild, isTruncated]);

  const hideTooltip = useCallback(() => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    setTooltipVisible(false);
  }, []);

  useEffect(() => () => hideTooltip(), [hideTooltip]);

  const categoryCell = (
    <View
      ref={cellRef}
      collapsable={false}
      className={`flex-row items-center px-2 py-2 border-r border-brand-grey-hover ${categoryCellBg}`}
      style={{
        width: CATEGORY_COLUMN_WIDTH,
        paddingLeft: isChild ? 16 : 8,
      }}
    >
      <View className="flex-1 justify-center items-center">
        {isParent && (
          <IconSymbol name={iconName} size={20} color={Colors.primary} />
        )}
        <ThemedText
          className={`text-center text-xs ${isParent ? 'mt-0.5 font-semibold' : ''}`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </ThemedText>
      </View>
    </View>
  );

  const categoryCellWithTooltip =
    isChild && isTruncated ? (
      <Pressable style={{ width: CATEGORY_COLUMN_WIDTH }} onPress={showTooltip}>
        {categoryCell}
      </Pressable>
    ) : null;

  return (
    <View className={`flex-row ${rowBg}`}>
      {isExpandable ? (
        <Pressable
          onPress={onToggleExpand}
          style={{ width: CATEGORY_COLUMN_WIDTH }}
        >
          {categoryCell}
        </Pressable>
      ) : categoryCellWithTooltip ? (
        categoryCellWithTooltip
      ) : (
        categoryCell
      )}
      {tooltipVisible && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={hideTooltip}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={hideTooltip}
          >
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: tooltipLayout.x,
                top: tooltipLayout.y,
                transform: [{ translateY: -44 }],
                backgroundColor: Colors.black,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                maxWidth: 200,
              }}
            >
              <ThemedText
                style={{ color: Colors.white, fontSize: 12 }}
                numberOfLines={3}
              >
                {rawLabel}
              </ThemedText>
            </View>
          </Pressable>
        </Modal>
      )}
      {days.map((day) => (
        <ExpenseTableCell key={day} amount={row.amountsByDay[day] ?? 0} />
      ))}
      <ExpenseTableCell amount={row.total} isTotalColumn />
    </View>
  );
});
