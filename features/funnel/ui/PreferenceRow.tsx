import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

import type { PreferenceIconName } from '@/features/funnel/lib/preferencesIcons';

export interface PreferenceRowProps {
  icon: PreferenceIconName;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export function PreferenceRow({
  icon,
  title,
  description,
  value,
  onToggle,
}: PreferenceRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => onToggle(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {description ? (
          <ThemedText style={styles.description} numberOfLines={2}>
            {description}
          </ThemedText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.greyHover, true: Colors.primaryActive }}
        thumbColor={Colors.white}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.greyHover,
  },
  rowPressed: {
    opacity: 0.9,
  },
  iconContainer: {
    width: 40,
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
    fontWeight: '600',
    color: Colors.black,
  },
  description: {
    fontSize: 13,
    color: Colors.grey,
    marginTop: 2,
  },
});
