import type { TFunction } from 'i18next';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Category } from '@/entities/category';
import type { ScannedDraftItem } from '@/features/receipt-scan/model/types';
import { getReceiptItemCategoryCaption } from '@/features/receipt-scan/lib/receiptCategoryCaption';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

type ReceiptReviewLineItemsListProps = {
  items: ScannedDraftItem[];
  categories: Category[];
  currency: string;
  t: TFunction;
  onConfirmDelete: (itemId: number) => void;
};

export function ReceiptReviewLineItemsList({
  items,
  categories,
  currency,
  t,
  onConfirmDelete,
}: ReceiptReviewLineItemsListProps) {
  const canDeleteLine = items.length > 1;

  return (
    <>
      <ThemedText className="mb-3 mt-6 text-xs font-medium uppercase tracking-wider text-brand-grey">
        {t('add.receiptScan.review.itemsHeading')}
      </ThemedText>

      {items.map((item) => {
        const caption =
          getReceiptItemCategoryCaption(
            categories,
            item.categoryId,
            (key, opts) => t(key, opts)
          ) ||
          item.categoryLabel ||
          '';

        return (
          <View
            key={item.id}
            className="mb-3 rounded-2xl bg-white px-4 py-3"
            style={styles.card}
          >
            <View className="flex-row items-start justify-between gap-2">
              <ThemedText
                className="flex-1 text-base font-medium"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.label}
              </ThemedText>
              <ThemedText type="defaultSemiBold" className="text-base">
                {formatMinorAsCurrency(item.amount, currency)}
              </ThemedText>
            </View>

            <View className="mt-2 flex-row items-start justify-between gap-2">
              <ThemedText
                className="flex-1 text-sm text-brand-grey"
                numberOfLines={2}
              >
                {caption}
              </ThemedText>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() =>
                    router.push(
                      `/(add)/scan-review-item?itemId=${item.id}` as never
                    )
                  }
                  hitSlop={8}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: Colors.primary }}
                  >
                    {t('add.receiptScan.review.edit')}
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => onConfirmDelete(item.id)}
                  disabled={!canDeleteLine}
                  hitSlop={8}
                  style={{ opacity: canDeleteLine ? 1 : 0.4 }}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: Colors.error }}
                  >
                    {t('add.receiptScan.review.delete')}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
