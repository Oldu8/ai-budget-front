import { router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { useCreateRecurringExpenseMutation } from '@/features/recurring-expenses/model/useCreateRecurringExpenseMutation';
import { toCreateRecurringExpensePayload } from '@/features/recurring-expenses/lib/toRecurringExpenseApiPayload';
import type { RecurringExpenseFormData } from '@/features/recurring-expenses/lib/recurringExpenseSchema';
import { RecurringExpenseForm } from '@/features/recurring-expenses/ui/RecurringExpenseForm';
import { useCategoriesQuery } from '@/features/home/model/useCategoriesQuery';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { useToast } from '@/shared/ui/Toast';

export default function NewRecurringExpenseScreen() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const { showToast, hideToast } = useToast();
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateRecurringExpenseMutation();

  const onSubmit = async (data: RecurringExpenseFormData) => {
    showToast({
      title: t('add.toast.processingTitle'),
      text: t('add.toast.processingText'),
      type: 'loading',
    });
    try {
      const payload = toCreateRecurringExpensePayload(data);
      await createMutation.mutateAsync(payload);
      hideToast();
      showToast({
        title: t('recurring.toast.savedTitle'),
        text: t('recurring.toast.savedText'),
        type: 'success',
      });
      router.back();
    } catch {
      hideToast();
      showToast({
        title: t('recurring.toast.errorTitle'),
        text: t('recurring.toast.errorText'),
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
          <RecurringExpenseForm
            mode="create"
            categories={categoriesQuery.data ?? []}
            isLoading={categoriesQuery.isPending}
            isSubmitting={createMutation.isPending}
            onSubmit={onSubmit}
          />
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
});
