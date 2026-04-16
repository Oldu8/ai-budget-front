import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

import type { NormalizedReceiptImage } from '@/features/receipt-scan/lib/normalizeReceiptAsset';
import {
  pickReceiptImageFromCamera,
  pickReceiptImageFromGallery,
  type PickReceiptImageResult,
} from '@/features/receipt-scan/lib/pickReceiptImage';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

const cardShadow = {
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
} as const;

type ReceiptSourceSheetProps = {
  onImageSelected: (image: NormalizedReceiptImage) => void;
  /** `primaryCard` = two actions inside the branded rounded card (Add tab). */
  variant?: 'default' | 'primaryCard';
  /** When true, blocks camera/gallery (e.g. while upload is in progress). */
  disabled?: boolean;
  /** Optional lock state to show paywall instead of starting scan. */
  isLocked?: boolean;
  onLockedPress?: () => void;
};

function handlePickResult(
  result: PickReceiptImageResult,
  t: (key: string) => string,
  onImageSelected: (image: NormalizedReceiptImage) => void,
) {
  if (result.status === 'success') {
    onImageSelected(result.image);
    return;
  }
  if (result.status === 'permission_denied') {
    Alert.alert(
      t('add.scan.permissionDeniedTitle'),
      t('add.scan.permissionDeniedMessage'),
    );
  }
}

export function ReceiptSourceSheet({
  onImageSelected,
  variant = 'default',
  disabled = false,
  isLocked = false,
  onLockedPress,
}: ReceiptSourceSheetProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<'camera' | 'gallery' | null>(null);
  const blocked = disabled || busy !== null;

  const runCamera = useCallback(async () => {
    if (isLocked) {
      onLockedPress?.();
      return;
    }
    setBusy('camera');
    try {
      const result = await pickReceiptImageFromCamera();
      handlePickResult(result, t, onImageSelected);
    } finally {
      setBusy(null);
    }
  }, [onImageSelected, t]);

  const runGallery = useCallback(async () => {
    if (isLocked) {
      onLockedPress?.();
      return;
    }
    setBusy('gallery');
    try {
      const result = await pickReceiptImageFromGallery();
      handlePickResult(result, t, onImageSelected);
    } finally {
      setBusy(null);
    }
  }, [onImageSelected, t]);

  const isCard = variant === 'primaryCard';

  return (
    <View
      className={
        isCard
          ? 'gap-3 self-center p-4 w-full max-w-xs rounded-2xl bg-brand-primary'
          : 'gap-3 px-6'
      }
      style={cardShadow}
    >
      <View
        className="justify-center items-center"
      >
        <IconSymbol name="camera.fill" size={48} color={Colors.white} />
        <ThemedText className="mt-3 text-base font-semibold" style={{ color: Colors.white }}>
          {t('add.scanReceipt')}
        </ThemedText>
      </View>
      <Pressable
        className="w-full items-center justify-center rounded-xl py-3.5"
        style={{
          backgroundColor: isCard ? Colors.white : Colors.primary,
        }}
        onPress={runCamera}
        disabled={blocked}
      >
        {busy === 'camera' ? (
          <ActivityIndicator color={isCard ? Colors.primary : Colors.white} />
        ) : (
          <ThemedText
            className="text-base font-semibold"
            style={{ color: isCard ? Colors.primary : Colors.white }}
          >
            {t('add.scan.takePhoto')}
          </ThemedText>
        )}
      </Pressable>

      <Pressable
        className="w-full items-center justify-center rounded-xl py-3.5"
        style={{ backgroundColor: Colors.greyLow }}
        onPress={runGallery}
        disabled={blocked}
      >
        {busy === 'gallery' ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <ThemedText className="text-base font-semibold text-brand-primary">
            {t('add.scan.chooseFromGallery')}
          </ThemedText>
        )}
      </Pressable>
    </View>
  );
}
