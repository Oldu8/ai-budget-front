import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

import type { IconSymbolName } from './SettingsRow.types';

export interface SettingsRowProps {
  icon: IconSymbolName;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  showChevron?: boolean;
}

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showChevron = true,
}: SettingsRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.right}>
        {value ? (
          <ThemedText style={styles.value} numberOfLines={1}>
            {value}
          </ThemedText>
        ) : null}
        {showChevron ? (
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={Colors.grey}
            style={styles.chevron}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 52,
  },
  rowPressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.grey,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 15,
    color: Colors.grey,
    maxWidth: 120,
  },
  chevron: {
    marginLeft: 4,
  },
});
