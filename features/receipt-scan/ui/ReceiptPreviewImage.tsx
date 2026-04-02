/**
 * Receipt signed-URL preview (GET /api/transactions/{id}/image).
 * Doesn't work, needs improvements — not used on the review screen until fixed.
 */
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getTransactionReceiptImage } from '@/features/receipt-scan/api/getTransactionReceiptImage';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

type ReceiptPreviewImageProps = {
  transactionId: number;
};

export function ReceiptPreviewImage({ transactionId }: ReceiptPreviewImageProps) {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['receiptImage', transactionId],
    queryFn: () => getTransactionReceiptImage(transactionId),
    /** Signed URLs are short-lived; refetch if user returns to screen after a while. */
    staleTime: 4 * 60 * 1000,
  });

  if (query.isPending) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator color={Colors.primary} />
        <ThemedText className="mt-2 text-sm text-brand-grey">
          {t('add.receiptScan.imageLoading')}
        </ThemedText>
      </View>
    );
  }

  if (query.isError || !query.data?.url) {
    return (
      <View style={styles.placeholder}>
        <ThemedText className="text-center text-sm text-brand-grey">
          {t('add.receiptScan.imageError')}
        </ThemedText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: query.data.url }}
      style={styles.image}
      contentFit="cover"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.greyLow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.greyLow,
  },
});
