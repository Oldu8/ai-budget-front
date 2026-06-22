import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { updateReceiptTransaction } from '@/features/receipt-scan/api/updateReceiptTransaction';
import { bypassReceiptReviewLeaveGuardOnce } from '@/features/receipt-scan/lib/receiptReviewLeaveGuard';
import { deleteTransaction } from '@/features/transactions/api/deleteTransaction';
import {
  isReceiptReviewDirty,
  sumReviewItemsMinor,
  useReceiptReviewStore,
} from '@/features/receipt-scan/model/useReceiptReviewStore';
import { useReceiptScanDraftStore } from '@/features/receipt-scan/model/useReceiptScanDraftStore';
import { useCategoriesQuery } from '@/features/home/model/useCategoriesQuery';
import { ApiError } from '@/shared/api/client';
import {
  formatDateKey,
  safeParseIsoDateToStartOfDay,
  toDateKey,
} from '@/shared/lib/parseIsoDate';
import { useToast } from '@/shared/ui/Toast';

type ReviewDateForm = { date: Date };

function replaceToAddTab() {
  router.replace('/(tabs)/add' as never);
}

export function useScanReview() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const draft = useReceiptScanDraftStore((s) => s.draft);
  const clearDraft = useReceiptScanDraftStore((s) => s.clearDraft);

  const transactionId = useReceiptReviewStore((s) => s.transactionId);
  const dateStr = useReceiptReviewStore((s) => s.date);
  const items = useReceiptReviewStore((s) => s.items);
  const removeItem = useReceiptReviewStore((s) => s.removeItem);
  const initFromDraft = useReceiptReviewStore((s) => s.initFromDraft);
  const clearReview = useReceiptReviewStore((s) => s.clear);

  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  const form = useForm<ReviewDateForm>({
    defaultValues: { date: startOfDay(new Date()) },
  });

  useEffect(() => {
    if (!draft || (transactionId != null && transactionId === draft.id)) return;
    initFromDraft(draft);
    form.reset({
      date: safeParseIsoDateToStartOfDay(toDateKey(draft.date)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init when draft id changes
  }, [draft?.id, transactionId, initFromDraft]);

  const totalMinor = useMemo(() => sumReviewItemsMinor(items), [items]);

  const confirmDisabled =
    items.length === 0 || items.some((i) => i.categoryId == null);

  const cancelReviewMutation = useMutation({
    mutationFn: async () => {
      const id = useReceiptReviewStore.getState().transactionId;
      if (id == null) throw new Error('Missing transaction');
      return deleteTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      clearReview();
      clearDraft();
      bypassReceiptReviewLeaveGuardOnce();
      router.back();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 404) {
        clearReview();
        clearDraft();
        bypassReceiptReviewLeaveGuardOnce();
        router.back();
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : t('add.receiptScan.review.errors.deleteFailed');
      showToast({
        title: t('add.toast.errorTitle'),
        text: message,
        type: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (transactionId == null) throw new Error('Missing transaction');
      const body = {
        date: formatDateKey(form.getValues('date')),
        items: items.map((i) => ({
          id: i.id,
          label: i.label.trim(),
          amount: i.amount,
          category_id: i.categoryId!,
        })),
      };
      return updateReceiptTransaction(transactionId, body);
    },
    onSuccess: () => {
      const state = useReceiptReviewStore.getState();
      const total = sumReviewItemsMinor(state.items);
      const savedDate = formatDateKey(form.getValues('date'));
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      clearReview();
      clearDraft();
      bypassReceiptReviewLeaveGuardOnce();
      router.replace(
        `/(add)/scan-success?totalMinor=${encodeURIComponent(String(total))}&date=${encodeURIComponent(savedDate)}` as never
      );
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 404) {
        clearReview();
        clearDraft();
        bypassReceiptReviewLeaveGuardOnce();
        replaceToAddTab();
        return;
      }
    },
  });

  const handleUpdateErrorRetry = () => {
    updateMutation.reset();
    clearReview();
    clearDraft();
    bypassReceiptReviewLeaveGuardOnce();
    replaceToAddTab();
  };

  const handleConfirm = () => {
    if (confirmDisabled || transactionId == null) return;
    updateMutation.mutate();
  };

  const handleCancelReview = () => {
    if (transactionId == null) return;

    const runDelete = () => cancelReviewMutation.mutate();

    const dirty = isReceiptReviewDirty();
    if (dirty) {
      Alert.alert(
        t('add.receiptScan.review.cancelDirtyTitle'),
        t('add.receiptScan.review.cancelDirtyMessage'),
        [
          { text: t('buttons.cancel'), style: 'cancel' },
          {
            text: t('add.receiptScan.review.discard'),
            style: 'destructive',
            onPress: runDelete,
          },
        ]
      );
      return;
    }
    runDelete();
  };

  const confirmDeleteItem = (itemId: number) => {
    const isLastLine = items.length === 1;
    Alert.alert(
      isLastLine
        ? t('add.receiptScan.review.deleteLastLineTitle')
        : t('add.receiptScan.review.deleteConfirmTitle'),
      isLastLine
        ? t('add.receiptScan.review.deleteLastLineMessage')
        : t('add.receiptScan.review.deleteConfirmMessage'),
      [
        { text: t('buttons.cancel'), style: 'cancel' },
        {
          text: t('add.receiptScan.review.delete'),
          style: 'destructive',
          onPress: () =>
            isLastLine ? cancelReviewMutation.mutate() : removeItem(itemId),
        },
      ]
    );
  };

  const showEmptyState = !draft && transactionId == null;
  const showContent = transactionId != null;
  const showUpdateError = updateMutation.isError;

  return {
    draft,
    transactionId,
    dateStr,
    items,
    categories,
    form,
    totalMinor,
    confirmDisabled,
    /** True while confirming line items / discarding AI draft via API — blocks leaving without dialog. */
    reviewNavigationBusy:
      updateMutation.isPending || cancelReviewMutation.isPending,
    updateMutation,
    cancelReviewMutation,
    handleConfirm,
    handleCancelReview,
    confirmDeleteItem,
    handleUpdateErrorRetry,
    showEmptyState,
    showContent,
    showUpdateError,
  };
}
