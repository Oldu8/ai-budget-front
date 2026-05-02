import { useHeaderHeight } from '@react-navigation/elements';
import { format, startOfDay } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import {
  sumReviewItemsMinor,
  useReceiptReviewStore,
} from '@/features/receipt-scan/model/useReceiptReviewStore';
import { ReceiptReviewLineItemsList } from '@/features/receipt-scan/ui/ReceiptReviewLineItemsList';
import { ScanReviewSummaryCard } from '@/features/receipt-scan/ui/ScanReviewSummaryCard';
import { mapTransactionDetailToScannedDraft } from '@/features/transactions/lib/mapTransactionToScannedDraft';
import { useCategoriesQuery } from '@/features/transactions/model/useCategoriesQuery';
import { useDeleteTransactionMutation } from '@/features/transactions/model/useDeleteTransactionMutation';
import { useTransactionQuery } from '@/features/transactions/model/useTransactionQuery';
import { useUpdateReceiptTransactionMutation } from '@/features/transactions/model/useUpdateReceiptTransactionMutation';
import { TransactionDateField } from '@/features/transactions/ui/TransactionDateField';
import { ApiError } from '@/shared/api/client';
import { safeParseIsoDateToStartOfDay } from '@/shared/lib/parseIsoDate';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';
import { useToast } from '@/shared/ui/Toast';

type DateForm = { date: Date };

export default function HistoryTransactionDetailScreen() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const { showToast } = useToast();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const transactionId = idParam != null ? Number(idParam) : NaN;
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');

  const { data, isLoading, isError, refetch } = useTransactionQuery(
    Number.isFinite(transactionId) ? transactionId : null
  );

  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  const initFromDraft = useReceiptReviewStore((s) => s.initFromDraft);
  const clearReview = useReceiptReviewStore((s) => s.clear);
  const items = useReceiptReviewStore((s) => s.items);
  const storeDate = useReceiptReviewStore((s) => s.date);
  const setDate = useReceiptReviewStore((s) => s.setDate);
  const removeItem = useReceiptReviewStore((s) => s.removeItem);
  const transactionIdStore = useReceiptReviewStore((s) => s.transactionId);

  const dateForm = useForm<DateForm>({
    values: {
      date: safeParseIsoDateToStartOfDay(
        storeDate ||
        data?.date ||
        format(startOfDay(new Date()), 'yyyy-MM-dd')
      ),
    },
  });

  useEffect(() => {
    if (!data) return;
    initFromDraft(mapTransactionDetailToScannedDraft(data));
    return () => {
      clearReview();
    };
    // Intentionally only when transaction id changes — avoid resetting the store on refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- data is read when id changes
  }, [data?.id, initFromDraft, clearReview]);

  const watchedDate = useWatch({ control: dateForm.control, name: 'date' });

  useEffect(() => {
    if (!watchedDate || !transactionIdStore) return;
    const next = format(startOfDay(watchedDate), 'yyyy-MM-dd');
    if (next !== storeDate) setDate(next);
  }, [watchedDate, transactionIdStore, storeDate, setDate]);

  const receiptUpdateMutation = useUpdateReceiptTransactionMutation(
    Number.isFinite(transactionId) ? transactionId : 0
  );
  const deleteTransactionMutation = useDeleteTransactionMutation();

  const totalMinor = useMemo(() => sumReviewItemsMinor(items), [items]);

  const confirmDisabled =
    items.length === 0 || items.some((i) => i.categoryId == null);

  const handleSave = () => {
    if (!Number.isFinite(transactionId) || confirmDisabled) return;
    receiptUpdateMutation.mutate(
      {
        date: storeDate,
        items: items.map((i) => ({
          id: i.id,
          label: i.label.trim(),
          amount: i.amount,
          category_id: i.categoryId!,
        })),
      },
      {
        onSuccess: () => {
          clearReview();
          showToast({
            title: t('add.toast.successTitle'),
            text: t('add.toast.successText'),
            type: 'success',
          });
          router.back();
        },
        onError: () => {
          showToast({
            title: t('add.toast.errorTitle'),
            text: t('add.receiptScan.review.errors.updateFailed'),
            type: 'error',
          });
        },
      }
    );
  };

  const confirmDeleteItem = (itemId: number) => {
    const isLastLine = items.length === 1;
    Alert.alert(
      isLastLine
        ? t('history.deleteLastLineTitle')
        : t('add.receiptScan.review.deleteConfirmTitle'),
      isLastLine
        ? t('history.deleteLastLineMessage')
        : t('add.receiptScan.review.deleteConfirmMessage'),
      [
        { text: t('buttons.cancel'), style: 'cancel' },
        {
          text: t('add.receiptScan.review.delete'),
          style: 'destructive',
          onPress: () => {
            if (isLastLine) {
              if (!Number.isFinite(transactionId)) return;
              deleteTransactionMutation.mutate(transactionId, {
                onSuccess: () => {
                  clearReview();
                  showToast({
                    title: t('add.toast.successTitle'),
                    text: t('history.deleteExpenseSuccess'),
                    type: 'success',
                  });
                  router.back();
                },
                onError: (err: unknown) => {
                  if (err instanceof ApiError && err.status === 404) {
                    clearReview();
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
            } else {
              removeItem(itemId);
            }
          },
        },
      ]
    );
  };

  const busy =
    receiptUpdateMutation.isPending || deleteTransactionMutation.isPending;

  if (!Number.isFinite(transactionId)) {
    return null;
  }

  if (isLoading || !data) {
    return (
      <ScreenContainer variant="default" edges={['bottom']} style={styles.screen}>
        <View className="flex-1 justify-center items-center py-16">
          <ActivityIndicator />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer variant="default" edges={['bottom']} style={styles.screen}>
        <ThemedText className="px-4 pt-6 text-center text-brand-grey">
          {t('history.errorTitle')}
        </ThemedText>
        <View className="px-4 mt-4">
          <Button variant="primary" onPress={() => refetch()}>
            {t('history.errorRetry')}
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="default" edges={['bottom']} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
        style={styles.keyboard}
      >
        <ScrollView
          style={styles.scroll}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TransactionDateField
            control={dateForm.control}
            name="date"
            disabled={busy}
          />
          <ScanReviewSummaryCard
            totalMinor={totalMinor}
            itemCount={items.length}
            currency={currency}
          />
          <ReceiptReviewLineItemsList
            items={items}
            categories={categories}
            currency={currency}
            t={t}
            onConfirmDelete={confirmDeleteItem}
            buildEditItemHref={(itemId) =>
              `/(tabs)/history/line-item?itemId=${itemId}`
            }
          />
          <View className="gap-3 px-0 mt-6">
            <Button
              variant="primary"
              onPress={handleSave}
              disabled={confirmDisabled || busy}
              loading={receiptUpdateMutation.isPending}
            >
              {t('history.saveChanges')}
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                clearReview();
                router.back();
              }}
              disabled={busy}
            >
              {t('history.cancelEdit')}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 32,
  },
});
