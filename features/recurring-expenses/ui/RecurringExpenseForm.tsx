import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { Category } from '@/entities/category';
import {
  getDefaultRecurringExpenseFormValues,
  recurringExpenseSchema,
  recurringExpenseToFormData,
  type RecurringExpenseFormData,
} from '@/features/recurring-expenses/lib/recurringExpenseSchema';
import type { RecurringExpense } from '@/features/recurring-expenses/types';
import { EndDateField } from '@/features/recurring-expenses/ui/EndDateField';
import { FrequencySegmented } from '@/features/recurring-expenses/ui/FrequencySegmented';
import { AmountInput } from '@/features/transactions/ui/AmountInput';
import { CategoryGrid } from '@/features/transactions/ui/CategoryGrid';
import { TransactionDateField } from '@/features/transactions/ui/TransactionDateField';
import { Colors } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/Button';
import { HookFormOutlinedTextField } from '@/shared/ui/HookFormOutlinedTextField';
import { ThemedText } from '@/shared/ui/ThemedText';

export type RecurringExpenseFormMode = 'create' | 'edit';

interface RecurringExpenseFormProps {
  mode: RecurringExpenseFormMode;
  categories: Category[];
  initialExpense?: RecurringExpense | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onSubmit: (payload: RecurringExpenseFormData) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

export function RecurringExpenseForm({
  mode,
  categories,
  initialExpense,
  isLoading = false,
  isSubmitting = false,
  isDeleting = false,
  onSubmit,
  onDelete,
}: RecurringExpenseFormProps) {
  const { t } = useTranslation();

  const form = useForm<RecurringExpenseFormData>({
    resolver: zodResolver(recurringExpenseSchema),
    mode: 'onChange',
    defaultValues: initialExpense
      ? recurringExpenseToFormData(initialExpense)
      : getDefaultRecurringExpenseFormValues(),
  });

  useEffect(() => {
    if (initialExpense) {
      form.reset(recurringExpenseToFormData(initialExpense));
    }
  }, [initialExpense, form]);

  const hasEndDate = useWatch({
    control: form.control,
    name: 'hasEndDate',
  });
  const startsAt = useWatch({ control: form.control, name: 'startsAt' });
  const endsAt = useWatch({ control: form.control, name: 'endsAt' });

  useEffect(() => {
    if (!hasEndDate) {
      form.setValue('endsAt', null, { shouldValidate: true });
    }
  }, [hasEndDate, form]);

  useEffect(() => {
    if (hasEndDate && endsAt == null && startsAt) {
      form.setValue('endsAt', startsAt, { shouldValidate: true });
    }
  }, [hasEndDate, endsAt, startsAt, form]);

  const subcategoryId = useWatch({
    control: form.control,
    name: 'subcategoryId',
  });
  const amount = useWatch({ control: form.control, name: 'amount' });
  const frequency = useWatch({ control: form.control, name: 'frequency' });

  const handleSubcategorySelect = (id: number | null) => {
    form.setValue('subcategoryId', id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const isValid =
    form.formState.isValid &&
    amount > 0 &&
    subcategoryId !== null &&
    subcategoryId > 0;

  const submit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <ScrollView
      bounces={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText style={styles.description}>
        {t('recurring.description')}
      </ThemedText>

      <AmountInput
        control={form.control}
        name="amount"
        disabled={isLoading || isSubmitting}
      />

      <HookFormOutlinedTextField
        control={form.control}
        name="label"
        label={t('recurring.label')}
        placeholder={t('recurring.labelPlaceholder')}
        disabled={isLoading || isSubmitting}
        emptyHandling="nullIfEmpty"
        maxLength={255}
      />

      <TransactionDateField
        control={form.control}
        name="startsAt"
        disabled={isLoading || isSubmitting}
        maximumDate={null}
        datePrefixI18nKey="recurring.startsOn"
      />

      <FrequencySegmented
        value={frequency}
        onChange={(v) =>
          form.setValue('frequency', v, { shouldValidate: true, shouldDirty: true })
        }
        disabled={isLoading || isSubmitting}
      />

      <EndDateField
        control={form.control}
        hasEndDateName="hasEndDate"
        endsAtName="endsAt"
        disabled={isLoading || isSubmitting}
      />

      <CategoryGrid
        categories={categories}
        selectedSubcategoryId={subcategoryId ?? null}
        onSelectSubcategory={handleSubcategorySelect}
        disabled={isLoading || isSubmitting}
      />

      <View className="px-0 mt-8 gap-3">
        <Button
          onPress={() => void submit()}
          disabled={!isValid || isLoading || isSubmitting}
          loading={isSubmitting}
          variant="primary"
        >
          {t('recurring.save')}
        </Button>
        {mode === 'edit' && onDelete ? (
          <Button
            onPress={() => void onDelete()}
            disabled={isLoading || isSubmitting || isDeleting}
            loading={isDeleting}
            variant="destructive"
          >
            {t('recurring.delete')}
          </Button>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey,
    paddingHorizontal: 4,
    marginTop: 8,
  },
});
