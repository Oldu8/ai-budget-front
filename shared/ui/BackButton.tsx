import { router } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';

const TOP_OFFSET = Platform.select({ ios: 8, default: 4 });
const HIT_SIZE = 36;
const ICON_SIZE = 22;

export interface BackButtonProps {
  /** Extra distance from top, if needed for a specific screen. */
  extraTop?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function BackButton({
  extraTop = 0,
  style,
  accessibilityLabel = 'Back',
}: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => router.back()}
      style={[
        styles.base,
        {
          top: TOP_OFFSET + extraTop,
        },
        style,
      ]}
    >
      <IconSymbol name="chevron.left" size={ICON_SIZE} color={Colors.black} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    left: 4,
    zIndex: 20,
    width: HIT_SIZE,
    height: HIT_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
      },
    }),
  },
});