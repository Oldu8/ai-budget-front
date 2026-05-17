import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { isVoiceExpenseDraft } from '@/features/receipt-scan/lib/isVoiceExpenseDraft';
import { consumeReceiptReviewLeaveGuard } from '@/features/receipt-scan/lib/receiptReviewLeaveGuard';
import { useScanReview } from '@/features/receipt-scan/model/useScanReview';
import { useReceiptScanDraftStore } from '@/features/receipt-scan/model/useReceiptScanDraftStore';
import { useReceiptReviewStore } from '@/features/receipt-scan/model/useReceiptReviewStore';
import { ReceiptReviewLineItemsList } from '@/features/receipt-scan/ui/ReceiptReviewLineItemsList';
import { ReceiptScanErrorScreen } from '@/features/receipt-scan/ui/ReceiptScanErrorScreen';
import { ScanReviewEmptyState } from '@/features/receipt-scan/ui/ScanReviewEmptyState';
import { ScanReviewSummaryCard } from '@/features/receipt-scan/ui/ScanReviewSummaryCard';
import { TransactionDateField } from '@/features/transactions/ui/TransactionDateField';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

/**
 * Receipt image preview is not wired here yet — see `ReceiptPreviewImage`
 * (doesn't work, needs improvements).
 */
export default function ScanReviewScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');

  const {
    draft,
    items,
    categories,
    form,
    totalMinor,
    confirmDisabled,
    reviewNavigationBusy,
    updateMutation,
    cancelReviewMutation,
    handleConfirm,
    handleCancelReview,
    confirmDeleteItem,
    handleUpdateErrorRetry,
    showEmptyState,
    showContent,
    showUpdateError,
  } = useScanReview();

  const busy = reviewNavigationBusy;

  const fromVoiceDraft = useMemo(
    () => (draft ? isVoiceExpenseDraft(draft.rawAiData) : false),
    [draft]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: fromVoiceDraft
        ? t('add.receiptScan.reviewTitleVoice')
        : t('add.receiptScan.reviewTitle'),
      headerLeft: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('buttons.goBack')}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
        >
          <IconSymbol name="chevron.left" size={22} color={Colors.black} />
        </Pressable>
      ),
    });
  }, [navigation, fromVoiceDraft, t]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (consumeReceiptReviewLeaveGuard()) return;

      const tid = useReceiptReviewStore.getState().transactionId;
      if (tid == null) return;

      if (busy) {
        e.preventDefault();
        return;
      }

      const rawAiData = useReceiptScanDraftStore.getState().draft?.rawAiData;
      const voice = isVoiceExpenseDraft(rawAiData);

      e.preventDefault();
      Alert.alert(
        voice
          ? t('add.receiptScan.review.leaveBackVoiceTitle')
          : t('add.receiptScan.review.leaveBackScanTitle'),
        voice
          ? t('add.receiptScan.review.leaveBackVoiceMessage')
          : t('add.receiptScan.review.leaveBackScanMessage'),
        [
          { text: t('buttons.cancel'), style: 'cancel' },
          {
            text: t('add.receiptScan.review.discard'),
            style: 'destructive',
            onPress: () => cancelReviewMutation.mutate(),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, busy, t, cancelReviewMutation]);

  if (showEmptyState) {
    return <ScanReviewEmptyState />;
  }

  if (showUpdateError) {
    return (
      <View style={styles.screen}>
        <ScreenContainer variant="default" edges={['bottom']}>
          <ReceiptScanErrorScreen onTryAgain={handleUpdateErrorRetry} />
        </ScreenContainer>
      </View>
    );
  }

  if (!showContent) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={['bottom']}>
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
            <ThemedText type="subtitle" className="pt-2 mb-3 text-brand-primary">
              {fromVoiceDraft
                ? t('add.receiptScan.voiceExpenseDraftLead')
                : t('add.receiptScan.receiptScanned')}
            </ThemedText>

            <TransactionDateField
              control={form.control}
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
            />

            {items.length === 0 ? (
              <ThemedText className="mb-4 text-sm text-brand-grey">
                {t('add.receiptScan.review.minOneItemHint')}
              </ThemedText>
            ) : null}

            <View className="gap-3 mt-4">
              <Button
                variant="primary"
                onPress={handleConfirm}
                disabled={confirmDisabled || busy}
                loading={updateMutation.isPending}
              >
                {t('add.receiptScan.review.confirmAll')}
              </Button>
              <Button
                variant="secondary"
                onPress={handleCancelReview}
                disabled={busy}
                loading={cancelReviewMutation.isPending}
              >
                {t('add.receiptScan.review.cancelReview')}
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
  scroll: {
    flex: 1,
  },
  /** Match manual add: top breathing room (see AmountInput padding) + full-height scroll. */
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerBack: {
    marginLeft: Platform.OS === 'ios' ? 8 : 4,
    paddingRight: 8,
    justifyContent: 'center',
  },
});
