import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';

type ScreenContainerVariant = 'default' | 'fullWidth';

export interface ScreenContainerProps {
  children: React.ReactNode;
  /** default = small horizontal + safe area insets; fullWidth = no horizontal padding (e.g. home with table). */
  variant?: ScreenContainerVariant;
  style?: ViewStyle;
}

const PADDING_HORIZONTAL = 24;

export function ScreenContainer({
  children,
  variant = 'default',
  style,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
  ];
  if (variant === 'default') {
    containerStyle.push(styles.padded);
  }

  return <ThemedView style={[containerStyle, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
});
