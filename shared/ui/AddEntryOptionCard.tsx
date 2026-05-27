import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

export interface AddEntryOptionCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

/** Shared title + subtitle card for Add tab secondary actions (manual, recurring, voice). */
export function AddEntryOptionCard({
  title,
  subtitle,
  onPress,
  accessibilityLabel,
}: AddEntryOptionCardProps) {
  const label = accessibilityLabel ?? `${title}. ${subtitle}`;

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Border + shadow on a plain View — iOS often skips these on Pressable alone. */
  card: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: 4,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      },
    }),
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 72,
  },
  pressed: {
    opacity: 0.92,
  },
  textBlock: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 18,
    textAlign: 'center',
  },
});
