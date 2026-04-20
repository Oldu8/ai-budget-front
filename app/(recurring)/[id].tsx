import { router, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { useDeleteRecurringExpenseMutation } from '@/features/recurring-expenses/model/useDeleteRecurringExpenseMutation';
import { useRecurringExpenseQuery } from '@/features/recurring-expenses/model/useRecurringExpenseQuery';
import { useUpdateRecurringExpenseMutation } from '@/features/recurring-expenses/model/useUpdateRecurringExpenseMutation';
import { toUpdateRecurringExpensePayload } from '@/features/recurring-expenses/lib/toRecurringExpenseApiPayload';
import type { RecurringExpenseFormData } from '@/features/recurring-expenses/lib/recurringExpenseSchema';
import { RecurringExpenseForm } from '@/features/recurring-expenses/ui/RecurringExpenseForm';
import { useCategoriesQuery } from '@/features/transactions/model/useCategoriesQuery';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';
import { useToast } from '@/shared/ui/Toast';

export default function EditRecurringExpenseScreen() {
  const { t } = useTranslation();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = useMemo(() => Number(idParam), [idParam]);
  const headerHeight = useHeaderHeight();
  const { showToast, hideToast } = useToast();

  const expenseQuery = useRecurringExpenseQuery(
    Number.isFinite(id) && id > 0 ? id : null
  );
  const categoriesQuery = useCategoriesQuery();
  const updateMutation = useUpdateRecurringExpenseMutation();
  const deleteMutation = useDeleteRecurringExpenseMutation();

  const expense = expenseQuery.data;

  const onSubmit = async (data: RecurringExpenseFormData) => {
    if (!expense) return;
    showToast({
      title: t('add.toast.processingTitle'),
      text: t('add.toast.processingText'),
      type: 'loading',
    });
    try {
      const payload = toUpdateRecurringExpensePayload(data);
      await updateMutation.mutateAsync({ id: expense.id, payload });
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

  const runDelete = useCallback(async () => {
    if (!expense) return;
    showToast({
      title: t('add.toast.processingTitle'),
      text: t('add.toast.processingText'),
      type: 'loading',
    });
    try {
      await deleteMutation.mutateAsync(expense.id);
      hideToast();
      showToast({
        title: t('recurring.toast.deletedTitle'),
        text: t('recurring.toast.deletedText'),
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
  }, [deleteMutation, expense, hideToast, showToast, t]);

  const onDelete = useCallback(() => {
    Alert.alert(
      t('recurring.deleteConfirm.title'),
      t('recurring.deleteConfirm.message'),
      [
        { text: t('recurring.deleteConfirm.cancel'), style: 'cancel' },
        {
          text: t('recurring.deleteConfirm.confirm'),
          style: 'destructive',
          onPress: () => void runDelete(),
        },
      ]
    );
  }, [runDelete, t]);

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <ScreenContainer variant="default">
        <ThemedText style={styles.errorCenter}>
          {t('recurring.notFound')}
        </ThemedText>
      </ScreenContainer>
    );
  }

  if (expenseQuery.isPending) {
    return (
      <ScreenContainer variant="default">
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </ScreenContainer>
    );
  }

  if (expenseQuery.isError || !expense) {
    return (
      <ScreenContainer variant="default">
        <ThemedText style={styles.errorCenter}>
          {t('recurring.notFound')}
        </ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
          style={styles.keyboard}
        >
          <RecurringExpenseForm
            mode="edit"
            categories={categoriesQuery.data ?? []}
            initialExpense={expense}
            isLoading={categoriesQuery.isPending}
            isSubmitting={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
            onSubmit={onSubmit}
            onDelete={onDelete}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  errorCenter: {
    textAlign: 'center',
    marginTop: 48,
    paddingHorizontal: 24,
    color: Colors.grey,
  },
});
