import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

type ScanUsageCapsuleProps = {
  scansRemaining: number;
  scansLimit: number;
};

/**
 * Pill badge: scanner icon + "remaining / limit" + SCAN(S) label (matches add tab design).
 *
 * Note: Do not use `type` on ThemedText here — types like `defaultSemiBold` set fixed
 * fontSize/lineHeight in StyleSheet, which overrides NativeWind `text-*` classes.
 * Use explicit `style` for typography when you need smaller than the default type.
 */
export function ScanUsageCapsule({ scansRemaining, scansLimit }: ScanUsageCapsuleProps) {
  const { t } = useTranslation();
  const labelKey =
    scansRemaining <= 1 ? 'add.scanUsageLabelScan' : 'add.scanUsageLabelScans';

  const countLine =
    scansLimit > 0
      ? `${scansRemaining} / ${scansLimit}`
      : String(scansRemaining);

  return (
    <View className="flex-row items-center self-end gap-2 rounded-full border border-brand-grey-hover bg-brand-white px-2 py-1.5">
      <MaterialIcons name="document-scanner" size={26} color={Colors.primary} />
      <View>
        <ThemedText
          className="text-brand-primary"
          style={{
            fontSize: 14,
            lineHeight: 16,
            fontWeight: '600',
          }}
        >
          {countLine}
        </ThemedText>
        <ThemedText
          className="text-brand-primary"
          style={{
            fontSize: 12,
            lineHeight: 14,
            fontWeight: '500',
            marginTop: 0,
            letterSpacing: 0.4,
          }}
        >
          {t(labelKey)}
        </ThemedText>
      </View>
    </View>
  );
}
