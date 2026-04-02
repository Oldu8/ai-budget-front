import { zodResolver } from '@hookform/resolvers/zod';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { getReceiptItemCategoryCaption } from '@/features/receipt-scan/lib/receiptCategoryCaption';
import {
  createReceiptItemEditSchema,
  type ReceiptItemEditFormData,
} from '@/features/receipt-scan/model/createReceiptItemEditSchema';
import { useReceiptReviewStore } from '@/features/receipt-scan/model/useReceiptReviewStore';
import { useCategoriesQuery } from '@/features/transactions/model/useCategoriesQuery';
import { AmountInput } from '@/features/transactions/ui/AmountInput';
import { CategoryGrid } from '@/features/transactions/ui/CategoryGrid';
import { ReceiptItemLabelField } from '@/features/receipt-scan/ui/ReceiptItemLabelField';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';

export default function ScanReviewItemScreen() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const { itemId: itemIdParam } = useLocalSearchParams<{ itemId: string }>();
  const itemId = itemIdParam != null ? Number(itemIdParam) : NaN;

  const item = useReceiptReviewStore((s) =>
    Number.isFinite(itemId) ? s.items.find((row) => row.id === itemId) : undefined
  );
  const updateItem = useReceiptReviewStore((s) => s.updateItem);

  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  const itemEditSchema = useMemo(() => createReceiptItemEditSchema(t), [t]);

  const defaultValues = useMemo((): ReceiptItemEditFormData => {
    if (!item) {
      return { label: '', amount: 0, subcategoryId: null };
    }
    return {
      label: item.label,
      amount: item.amount / 100,
      subcategoryId: item.categoryId ?? null,
    };
  }, [item]);

  const form = useForm<ReceiptItemEditFormData>({
    resolver: zodResolver(itemEditSchema),
    mode: 'onChange',
    defaultValues,
    values: defaultValues,
  });

  const subcategoryId = useWatch({
    control: form.control,
    name: 'subcategoryId',
  });

  useEffect(() => {
    if (!item) {
      router.back();
    }
  }, [item]);

  const handleSubcategorySelect = (id: number | null) => {
    form.setValue('subcategoryId', id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSave = form.handleSubmit((data) => {
    if (!item) return;
    const subId = data.subcategoryId;
    if (subId === null || subId <= 0) return;
    const categoryLabel = getReceiptItemCategoryCaption(
      categories,
      subId,
      (key, opts) => t(key, opts)
    );
    updateItem(item.id, {
      label: data.label.trim(),
      amount: Math.round(data.amount * 100),
      categoryId: subId,
      categoryLabel: categoryLabel || null,
    });
    router.back();
  });

  const isValid =
    form.formState.isValid &&
    form.watch('amount') > 0 &&
    subcategoryId !== null &&
    subcategoryId > 0 &&
    form.watch('label').trim().length > 0;

  if (!item) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BackButton />
      <ScreenContainer variant="default" edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
          style={styles.keyboard}
        >
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === 'ios' ? 'interactive' : 'on-drag'
            }
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ReceiptItemLabelField
              control={form.control}
              name="label"
              disabled={false}
            />

            <AmountInput
              control={form.control}
              name="amount"
              disabled={false}
            />

            <CategoryGrid
              categories={categories}
              selectedSubcategoryId={subcategoryId ?? null}
              onSelectSubcategory={handleSubcategorySelect}
              disabled={false}
            />

            <View className="mt-8 flex-row gap-3 px-0">
              <View className="flex-1">
                <Button
                  variant="secondary"
                  onPress={() => router.back()}
                >
                  {t('buttons.cancel')}
                </Button>
              </View>
              <View className="flex-1">
                <Button
                  variant="primary"
                  onPress={handleSave}
                  disabled={!isValid}
                >
                  {t('buttons.save')}
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});
