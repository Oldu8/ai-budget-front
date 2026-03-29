import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useReceiptScanDraftStore } from '@/features/receipt-scan/model/useReceiptScanDraftStore';
import { BackButton } from '@/shared/ui/BackButton';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

export default function ScanReviewScreen() {
  const { t } = useTranslation();
  const draft = useReceiptScanDraftStore((s) => s.draft);

  return (
    <View className="flex-1">
      <BackButton />
      <ThemedView className="flex-1 bg-brand-grey-low px-6 pt-2">
        <ThemedText type="title" className="text-brand-primary">
          {t('add.receiptScan.reviewPlaceholderTitle')}
        </ThemedText>

        {!draft ? (
          <ThemedText className="mt-4 text-base">—</ThemedText>
        ) : (
          <ScrollView
            className="mt-4 flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            <ThemedText type="defaultSemiBold" className="mb-2">
              {t('add.receiptScan.reviewSummary')}
            </ThemedText>
            <ThemedText className="mb-1 text-base">
              ID: {draft.id} · {draft.date} · {t('add.receiptScan.reviewTotal')}:{' '}
              {draft.totalAmount}
            </ThemedText>
            <ThemedText className="mb-1 text-base text-brand-grey">
              {draft.createdBy} · {draft.confirmedAt ?? '—'}
            </ThemedText>
            {draft.imgPath ? (
              <ThemedText
                className="mb-4 text-sm text-brand-grey"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {draft.imgPath}
              </ThemedText>
            ) : (
              <View className="mb-4" />
            )}

            {draft.items.length > 0 ? (
              <>
                <ThemedText type="defaultSemiBold" className="mb-2 mt-2">
                  {t('add.receiptScan.reviewItems')}
                </ThemedText>
                {draft.items.map((item) => (
                  <ThemedText key={item.id} className="mb-2 text-base leading-6">
                    • {item.label}
                    {'\n  '}
                    {item.amount}
                    {item.categoryLabel != null && item.categoryLabel !== ''
                      ? ` · ${item.categoryLabel}`
                      : ''}
                  </ThemedText>
                ))}
              </>
            ) : null}

            <ThemedText type="defaultSemiBold" className="mb-2 mt-4">
              {t('add.receiptScan.reviewStoredJson')}
            </ThemedText>
            <ThemedText selectable className="text-xs leading-5">
              {JSON.stringify(draft, null, 2)}
            </ThemedText>
          </ScrollView>
        )}
      </ThemedView>
    </View>
  );
}
