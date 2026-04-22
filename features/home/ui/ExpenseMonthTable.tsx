import { useHomeStore } from '@/features/home/model/homeStore';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';
import {
  CATEGORY_COLUMN_WIDTH,
  DAY_COLUMN_WIDTH,
  TOTAL_COLUMN_WIDTH,
} from '@/features/home/ui/expenseTableConstants';
import {
  ExpenseTableFooterCorner,
  ExpenseTableFooterDayCell,
  ExpenseTableFooterGrandTotalCell,
} from '@/features/home/ui/ExpenseTableFooter';
import {
  ExpenseTableHeaderCorner,
  ExpenseTableHeaderDayCell,
  ExpenseTableHeaderTotalCell,
} from '@/features/home/ui/ExpenseTableHeader';
import {
  ExpenseTableRowCells,
  ExpenseTableRowLabel,
} from '@/features/home/ui/ExpenseTableRow';
import { Colors } from '@/shared/constants/theme';
import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type ExpenseMonthTableProps = {
  refreshing?: boolean;
};

/**
 * Monthly expense grid with a 4-quadrant layout:
 *   - corner (top-left) + day headers (top-right)  — row 1, STICKY at top
 *   - category labels (bottom-left) + cells grid (bottom-right) — scrolls V/H
 *
 * Sticky behaviour is driven by `stickyHeaderIndices` on two vertical
 * `ScrollView`s (left labels column + right cells area). Their vertical
 * offsets are kept in sync via `scrollTo` — the right side is the source of
 * truth, the left side is `scrollEnabled=false` and follows.
 *
 * Horizontal scroll lives inside the right vertical `ScrollView` and is
 * shared between the sticky day-header row and the rows of cells via a
 * similar `scrollTo` sync.
 */
export function ExpenseMonthTable({ refreshing }: ExpenseMonthTableProps) {
  const { tableData } = useMonthlyExpenseTable();
  const toggleExpanded = useHomeStore((s) => s.toggleExpanded);
  const expandedIds = useHomeStore((s) => s.expandedIds);

  const { days, rows, totalsByDay, grandTotal } = tableData;

  const labelsVRef = useRef<ScrollView>(null);
  const bodyVRef = useRef<ScrollView>(null);
  const headerHRef = useRef<ScrollView>(null);
  const bodyHRef = useRef<ScrollView>(null);

  const dataContentWidth =
    days.length * DAY_COLUMN_WIDTH + TOTAL_COLUMN_WIDTH;

  const onBodyVScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      labelsVRef.current?.scrollTo({ y, animated: false });
    },
    []
  );

  const onBodyHScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      headerHRef.current?.scrollTo({ x, animated: false });
    },
    []
  );

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <View style={styles.quadrants}>
          {/* ── Left column: sticky corner + scrollable label list ── */}
          <ScrollView
            ref={labelsVRef}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={STICKY_INDICES}
            style={styles.labelsCol}
          >
            <View>
              <ExpenseTableHeaderCorner />
            </View>
            {rows.map((row) => (
              <ExpenseTableRowLabel
                key={`label-${row.id}`}
                row={row}
                isExpanded={
                  row.expandable ? expandedIds.has(row.id) : false
                }
                onToggleExpand={
                  row.expandable
                    ? () => toggleExpanded(row.id)
                    : undefined
                }
              />
            ))}
            <ExpenseTableFooterCorner />
          </ScrollView>

          {/* ── Right area: vertical scroll with sticky day-headers row ── */}
          <View style={styles.rightArea}>
            <ScrollView
              ref={bodyVRef}
              nestedScrollEnabled
              onScroll={onBodyVScroll}
              /** `1` ≈ per-frame — left column follows right tightly, no visible lag. */
              scrollEventThrottle={1}
              /** iOS: bounce on the right side can't be mirrored to the left (scrollTo clamps),
               *  so disable rubber-banding to keep both columns aligned at the edges. */
              bounces={false}
              alwaysBounceVertical={false}
              /** Android analogue of bounces=false. */
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={STICKY_INDICES}
              style={styles.flex1}
            >
              {/*
                Sticky index 0: a plain View wrapping the horizontal header
                scroll — RN's `stickyHeaderIndices` is reliable on Views, not
                on nested ScrollViews (nested ScrollView as sticky child tends
                to blow out to its content width on web).
              */}
              <View style={styles.stickyHeaderWrap}>
                <ScrollView
                  ref={headerHRef}
                  horizontal
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  <View style={styles.row}>
                    {days.map((day) => (
                      <ExpenseTableHeaderDayCell key={day} day={day} />
                    ))}
                    <ExpenseTableHeaderTotalCell />
                  </View>
                </ScrollView>
              </View>

              {/* Horizontal scroll holds rows + daily total row */}
              <ScrollView
                ref={bodyHRef}
                horizontal
                bounces={false}
                alwaysBounceHorizontal={false}
                overScrollMode="never"
                directionalLockEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onBodyHScroll}
                scrollEventThrottle={1}
                style={styles.horizontalScroll}
              >
                <View style={{ width: dataContentWidth }}>
                  {rows.map((row) => (
                    <ExpenseTableRowCells
                      key={`cells-${row.id}`}
                      row={row}
                      days={days}
                      isExpanded={
                        row.expandable ? expandedIds.has(row.id) : false
                      }
                    />
                  ))}
                  <View style={styles.row}>
                    {days.map((day) => (
                      <ExpenseTableFooterDayCell
                        key={`total-${day}`}
                        amount={totalsByDay[day] ?? 0}
                      />
                    ))}
                    <ExpenseTableFooterGrandTotalCell amount={grandTotal} />
                  </View>
                </View>
              </ScrollView>
            </ScrollView>
          </View>
        </View>

        {refreshing ? (
          <View
            pointerEvents="auto"
            style={[StyleSheet.absoluteFillObject, styles.refreshOverlay]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View style={styles.refreshOverlayInner}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const STICKY_INDICES = [0];

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 4,
  },
  card: {
    flex: 1,
    minHeight: 0,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    position: 'relative',
  },
  quadrants: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
  },
  labelsCol: {
    maxWidth: CATEGORY_COLUMN_WIDTH,
    width: CATEGORY_COLUMN_WIDTH,
  },
  rightArea: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  stickyHeaderWrap: {
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  horizontalScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  refreshOverlay: {
    zIndex: 20,
  },
  refreshOverlayInner: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
