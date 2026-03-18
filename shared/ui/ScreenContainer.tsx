import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/shared/ui/ThemedView';

type ScreenContainerVariant = 'default' | 'fullWidth';

export type SafeAreaEdge = 'top' | 'bottom';

export interface ScreenContainerProps {
  children: React.ReactNode;
  /** default = small horizontal + safe area insets; fullWidth = no horizontal padding (e.g. home with table). */
  variant?: ScreenContainerVariant;
  /**
   * Which edges get safe area padding. Use [] for tab screens (header/tab bar handle insets).
   * Default: ['top', 'bottom'] for standalone screens.
   */
  edges?: SafeAreaEdge[];
  style?: ViewStyle;
}

const PADDING_HORIZONTAL = 24;

const DEFAULT_EDGES: SafeAreaEdge[] = ['top', 'bottom'];

export function ScreenContainer({
  children,
  variant = 'default',
  edges = DEFAULT_EDGES,
  style,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      paddingTop: edges.includes('top') ? insets.top : 0,
      paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
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
