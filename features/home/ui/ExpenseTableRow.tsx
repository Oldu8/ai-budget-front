import type { TableRow } from '@/features/home/types';
import { ExpenseTableCell } from '@/features/home/ui/ExpenseTableCell';
import {
  CATEGORY_COLUMN_WIDTH,
  EXPANDED_PARENT_ROW_TINT,
  ROW_HEIGHT,
} from '@/features/home/ui/expenseTableConstants';
import { Colors } from '@/shared/constants/theme';
import { getCategoryMaterialIconName } from '@/shared/lib/categoryIcons';
import { CategoryIcon } from '@/shared/ui/CategoryIcon';
import { ThemedText } from '@/shared/ui/ThemedText';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

const TOOLTIP_DURATION_MS = 3000;

interface ExpenseTableRowSharedProps {
  row: TableRow;
  days: number[];
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

/** Left column: icon + label (sticky vertically). */
export const ExpenseTableRowLabel = memo(function ExpenseTableRowLabel({
  row,
  isExpanded,
  onToggleExpand,
}: Pick<ExpenseTableRowSharedProps, 'row' | 'isExpanded' | 'onToggleExpand'>) {
  const { t } = useTranslation();
  const isExpandable = row.expandable === true;
  const isParent = row.level === 'parent';
  const slug = row.categorySlug ?? '';
  const materialIcon =
    row.level === 'child'
      ? getCategoryMaterialIconName(slug, 'child', row.parentCategorySlug)
      : getCategoryMaterialIconName(slug, 'parent');

  const rawLabel = row.categorySlug
    ? t(`categories.${row.categorySlug}`, { defaultValue: row.label })
    : row.label;
  const label = rawLabel.length > 12 ? `${rawLabel.slice(0, 12)}…` : rawLabel;
  const isTruncated = rawLabel.length > 12;

  const isChild = row.level === 'child';
  const expandedParent =
    isParent && isExpandable && isExpanded;
  const categoryCellBg = expandedParent
    ? EXPANDED_PARENT_ROW_TINT
    : isChild
      ? Colors.white
      : Colors.greyLow;

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

  const labelStyle = expandedParent
    ? { fontSize: 12, fontWeight: '700' as const, color: Colors.primary }
    : isChild
      ? {
        fontSize: 10,
        fontStyle: 'italic' as const,
        color: Colors.grey,
        fontWeight: '400' as const,
      }
      : {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.black,
      };

  const categoryCell = (
    <View
      ref={cellRef}
      collapsable={false}
      style={{
        width: CATEGORY_COLUMN_WIDTH,
        height: ROW_HEIGHT,
        backgroundColor: categoryCellBg,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.greyHover,
        paddingLeft: isChild ? 22 : 8,
        paddingRight: 8,
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {isParent && (
          <CategoryIcon name={materialIcon} size={16} color={Colors.primary} />
        )}
        <Text
          style={[labelStyle, { flex: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>
    </View>
  );

  const categoryCellWithTooltip =
    isChild && isTruncated ? (
      <Pressable
        style={{ width: CATEGORY_COLUMN_WIDTH }}
        onPress={showTooltip}
      >
        {categoryCell}
      </Pressable>
    ) : null;

  const inner =
    isExpandable ? (
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
    );

  return (
    <View>
      {inner}
      {tooltipVisible && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={hideTooltip}
        >
          <Pressable style={{ flex: 1 }} onPress={hideTooltip}>
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
    </View>
  );
});

/** Right columns: day amounts + total (scrolls with body). */
export const ExpenseTableRowCells = memo(function ExpenseTableRowCells({
  row,
  days,
  isExpanded,
}: Pick<ExpenseTableRowSharedProps, 'row' | 'days' | 'isExpanded'>) {
  const isParent = row.level === 'parent';
  const isExpandable = row.expandable === true;
  const expandedParent = isParent && isExpandable && isExpanded;
  const tone = expandedParent ? 'primary' : 'default';

  const rowBg = expandedParent
    ? EXPANDED_PARENT_ROW_TINT
    : row.level === 'child'
      ? Colors.white
      : Colors.greyLow;

  return (
    <View style={{ flexDirection: 'row', backgroundColor: rowBg }}>
      {days.map((day) => (
        <ExpenseTableCell
          key={day}
          amount={row.amountsByDay[day] ?? 0}
          tone={tone}
        />
      ))}
      <ExpenseTableCell
        amount={row.total}
        isTotalColumn
        tone={tone}
        isChildRow={row.level === 'child'}
      />
    </View>
  );
});
