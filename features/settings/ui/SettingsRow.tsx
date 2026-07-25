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
  /** Chevron for navigation, picker for modal. Default: chevron */
  disclosureType?: 'chevron' | 'picker';
  /** Red title/icon for destructive actions (e.g. delete account). */
  destructive?: boolean;
}

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showChevron = true,
  disclosureType = 'chevron',
  destructive = false,
}: SettingsRowProps) {
  const accent = destructive ? Colors.error : Colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, pressed && styles.rowPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={22} color={accent} />
        </View>
        <View style={styles.content}>
          <ThemedText
            style={[styles.title, destructive && styles.titleDestructive]}
            numberOfLines={1}
          >
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
              name={disclosureType === 'picker' ? 'keyboard-arrow-down' : 'chevron-right'}
              size={22}
              color={Colors.grey}
              style={styles.chevron}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    minHeight: 52,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: '100%',
  },
  rowPressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 36,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    minWidth: 0,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  titleDestructive: {
    color: Colors.error,
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
    flexShrink: 0,
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
