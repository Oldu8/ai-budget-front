import { router } from 'expo-router';
import type { TFunction } from 'i18next';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Category } from '@/entities/category';
import { getReceiptItemCategoryParts } from '@/features/receipt-scan/lib/receiptCategoryCaption';
import type { ScannedDraftItem } from '@/features/receipt-scan/model/types';
import { Colors } from '@/shared/constants/theme';
import { getCategoryMaterialIconName } from '@/shared/lib/categoryIcons';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { CategoryIcon } from '@/shared/ui/CategoryIcon';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

/** Light mint tint for category icon tile (brand primary-active based). */
const CATEGORY_ICON_TILE_BG = 'rgba(0, 0, 0, 0.22)';

type ReceiptReviewLineItemsListProps = {
  items: ScannedDraftItem[];
  categories: Category[];
  currency: string;
  t: TFunction;
  onConfirmDelete: (itemId: number) => void;
  /** Defaults to `/(add)/scan-review-item` — pass when editing from another stack (e.g. History). */
  buildEditItemHref?: (itemId: number) => string;
};

export function ReceiptReviewLineItemsList({
  items,
  categories,
  currency,
  t,
  onConfirmDelete,
  buildEditItemHref = (itemId) =>
    `/(add)/scan-review-item?itemId=${itemId}`,
}: ReceiptReviewLineItemsListProps) {
  return (
    <>
      <ThemedText className="mt-6 mb-3 text-xs font-medium tracking-wider uppercase text-brand-grey">
        {t('add.receiptScan.review.itemsHeading')}
      </ThemedText>

      {items.map((item) => {
        const parts = getReceiptItemCategoryParts(
          categories,
          item.categoryId,
          (key, opts) => t(key, opts)
        );
        const tagLabels: string[] = [];
        if (parts.parentLabel) tagLabels.push(parts.parentLabel);
        if (parts.subLabel) tagLabels.push(parts.subLabel);
        if (tagLabels.length === 0 && item.categoryLabel?.trim()) {
          tagLabels.push(item.categoryLabel.trim());
        }

        const materialIcon =
          parts.parentName != null
            ? getCategoryMaterialIconName(
              parts.categoryName,
              'child',
              parts.parentName
            )
            : getCategoryMaterialIconName(parts.categoryName, 'child');

        const trimmedLabel = item.label.trim();

        return (
          <View key={item.id} style={styles.card}>
            <View style={styles.topBlock}>
              <View style={styles.topRow}>
                <View style={styles.iconTile}>
                  <CategoryIcon name={materialIcon} size={24} color={Colors.primary} />
                </View>
                <View style={styles.mainCol}>
                  <View style={styles.titlePriceRow}>
                    <ThemedText
                      style={trimmedLabel ? styles.title : styles.titleMuted}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {trimmedLabel ? trimmedLabel : t('history.noLabel')}
                    </ThemedText>
                    <ThemedText
                      lightColor={Colors.primary}
                      style={styles.price}
                      numberOfLines={1}
                    >
                      {formatMinorAsCurrency(item.amount, currency)}
                    </ThemedText>
                  </View>
                  {tagLabels.length > 0 ? (
                    <View style={styles.tagsWrap}>
                      {tagLabels.map((label, tagIndex) => (
                        <View key={`${item.id}-tag-${tagIndex}`} style={styles.tag}>
                          <ThemedText style={styles.tagText} numberOfLines={2}>
                            {label.toUpperCase()}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() =>
                  router.push(buildEditItemHref(item.id) as never)
                }
                hitSlop={8}
                style={styles.actionHit}
              >
                <IconSymbol name="pencil" size={18} color={Colors.grey} />
                <ThemedText style={styles.actionLabel}>
                  {t('add.receiptScan.review.edit').toUpperCase()}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => onConfirmDelete(item.id)}
                hitSlop={8}
                style={styles.actionHit}
              >
                <IconSymbol name="trash" size={18} color={Colors.grey} />
                <ThemedText style={styles.actionLabel}>
                  {t('add.receiptScan.review.delete').toUpperCase()}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.greyHover,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
  topBlock: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconTile: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: CATEGORY_ICON_TILE_BG,
  },
  mainCol: {
    flex: 1,
    minWidth: 0,
  },
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    lineHeight: 22,
  },
  titleMuted: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grey,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    flexShrink: 0,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.greyLow,
    maxWidth: '100%',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: Colors.grey,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.greyHover,
    marginHorizontal: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionHit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Colors.grey,
  },
});
