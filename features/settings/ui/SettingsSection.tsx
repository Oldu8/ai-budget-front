import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

export interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const items = React.Children.toArray(children) as React.ReactElement[];
  return (
    <View style={styles.container}>
      {title ? (
        <ThemedText style={styles.title}>{title}</ThemedText>
      ) : null}
      <View style={styles.card}>
        {items.map((child, index) => (
          <View
            key={index}
            style={[
              styles.rowWrapperBase,
              index < items.length - 1 && styles.rowWrapperBorder,
            ]}
          >
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grey,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    overflow: 'hidden',
  },
  rowWrapperBase: {
    width: '100%',
  },
  rowWrapperBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyHover,
  },
});
