import type { AnalyticsCategory } from '@/features/analytics/model/types';
import { Colors } from '@/shared/constants/theme';
import { getCategoryMaterialIconName } from '@/shared/lib/categoryIcons';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { CategoryIcon } from '@/shared/ui/CategoryIcon';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type CategoryBarsProps = {
  categories: AnalyticsCategory[];
  currency: string;
};

const ICON_CHIP_SIZE = 40;
const PROGRESS_BAR_HEIGHT = 8;

/**
 * Spending-by-category rows aligned with Stitch list pattern: dark icon chip + white glyph,
 * name vs amount “(pct%)”, single brand-colored progress bar. Icons match Home table (`CategoryIcon` + slug map).
 */
export function CategoryBars({ categories, currency }: CategoryBarsProps) {
  return (
    <View style={styles.list}>
      {categories.map((cat) => {
        const iconName = getCategoryMaterialIconName(cat.slug, 'parent');
        const barPercent = Math.min(100, Math.max(0, cat.bar_percent));

        return (
          <ThemedView key={cat.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.iconChip}>
                <CategoryIcon name={iconName} size={22} color={Colors.white} />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={styles.categoryTitle}
                numberOfLines={1}
              >
                {cat.label}
              </ThemedText>
              <Text style={styles.amountLine} numberOfLines={1}>
                <Text style={styles.amountPart}>
                  {formatMinorAsCurrency(cat.amount, currency)}
                </Text>
                <Text style={styles.percentParens}>{` (${cat.percent.toFixed(1)}%)`}</Text>
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[styles.barFill, { width: `${barPercent}%` }]}
              />
            </View>
          </ThemedView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconChip: {
    width: ICON_CHIP_SIZE,
    height: ICON_CHIP_SIZE,
    borderRadius: ICON_CHIP_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    minWidth: 0,
  },
  amountLine: {
    flexShrink: 0,
    maxWidth: '46%',
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  amountPart: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '600',
  },
  percentParens: {
    color: Colors.grey,
    fontSize: 15,
    fontWeight: '600',
  },
  barTrack: {
    height: PROGRESS_BAR_HEIGHT,
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
    backgroundColor: Colors.greyHover,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
    backgroundColor: Colors.primary,
  },
});
