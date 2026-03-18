import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isSecondary = variant === 'secondary';
  const isDestructive = variant === 'destructive';

  const buttonStyle = isDestructive
    ? styles.destructive
    : isSecondary
      ? styles.secondary
      : styles.primary;

  const textStyle = isDestructive
    ? styles.destructiveText
    : isSecondary
      ? styles.secondaryText
      : styles.primaryText;

  const loaderColor = isDestructive
    ? Colors.error
    : isSecondary
      ? Colors.primary
      : Colors.white;

  return (
    <Pressable
      style={[
        styles.button,
        buttonStyle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={children}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <ThemedText style={[styles.text, textStyle]}>{children}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  destructive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyHover,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primary,
  },
  destructiveText: {
    color: Colors.error,
  },
});
