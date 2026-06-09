import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { getDefaultExpenseFormValues } from '@/features/transactions/lib/createExpenseSchema';
import { useCategoriesQuery } from '@/features/home/model/useCategoriesQuery';
import { useCreateTransaction } from '@/features/transactions/model/useCreateTransaction';
import { AmountInput } from '@/features/transactions/ui/AmountInput';
import { CategoryGrid } from '@/features/transactions/ui/CategoryGrid';
import { TransactionDateField } from '@/features/transactions/ui/TransactionDateField';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { useToast } from '@/shared/ui/Toast';
import { useWatch } from 'react-hook-form';

export default function ManualAddScreen() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const { showToast, hideToast } = useToast();
  const { form, onSubmit, isValid, isLoading } = useCreateTransaction();
  const categoriesQuery = useCategoriesQuery();

  const categories = categoriesQuery.data ?? [];
  const subcategoryId = useWatch({
    control: form.control,
    name: 'subcategoryId',
  });

  const handleSubcategorySelect = (id: number | null) => {
    form.setValue('subcategoryId', id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSubmit = async () => {
    showToast({
      title: t('add.toast.processingTitle'),
      text: t('add.toast.processingText'),
      type: 'loading',
    });

    try {
      await onSubmit();
      hideToast();
      showToast({
        title: t('add.toast.successTitle'),
        text: t('add.toast.successText'),
        type: 'success',
      });
      form.reset(getDefaultExpenseFormValues());
      router.back();
    } catch {
      hideToast();
      showToast({
        title: t('add.toast.errorTitle'),
        text: t('add.toast.errorText'),
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.screen}>
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
            <AmountInput
              control={form.control}
              name="amount"
              disabled={isLoading}
            />

            <TransactionDateField
              control={form.control}
              name="date"
              disabled={isLoading}
            />

            <CategoryGrid
              categories={categories}
              selectedSubcategoryId={subcategoryId ?? null}
              onSelectSubcategory={handleSubcategorySelect}
              disabled={isLoading}
            />

            <View className="px-0 mt-8">
              <Button
                onPress={handleSubmit}
                disabled={!isValid || isLoading}
                loading={isLoading}
                variant="primary"
              >
                {t('add.manual.saveExpense')}
              </Button>
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
    paddingBottom: 16,
  },
});
