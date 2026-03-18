import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { SearchableSelect } from '@/shared/ui/SearchableSelect';
import { ThemedText } from '@/shared/ui/ThemedText';
import type { SelectItem } from '@/shared/ui/SearchableSelect';

import type { IconSymbolName } from './SettingsRow.types';

export interface SettingsPickerRowProps {
  icon: IconSymbolName;
  title: string;
  subtitle?: string;
  items: SelectItem[];
  value: string | null;
  onChange: (value: string) => Promise<void>;
  getDisplayValue: (value: string | null) => string | undefined;
  placeholder: string;
  error?: string | null;
}

export function SettingsPickerRow({
  icon,
  title,
  subtitle,
  items,
  value,
  onChange,
  getDisplayValue,
  placeholder,
  error,
}: SettingsPickerRowProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    async (newValue: string) => {
      setIsSaving(true);
      try {
        await onChange(newValue);
      } finally {
        setIsSaving(false);
      }
    },
    [onChange]
  );

  const displayValue = getDisplayValue(value);

  return (
    <View>
      <SearchableSelect
        items={items}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        autoFocusSearch={false}
        renderTrigger={({ onPress }) => (
          <Pressable
            style={({ pressed }) => [styles.pressable, pressed && styles.rowPressed]}
            onPress={onPress}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel={title}
          >
            <View style={styles.row}>
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
                {isSaving ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    {displayValue ? (
                      <ThemedText style={styles.value} numberOfLines={1}>
                        {displayValue}
                      </ThemedText>
                    ) : null}
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={22}
                      color={Colors.grey}
                      style={styles.chevron}
                    />
                  </>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
      {error ? (
        <ThemedText style={styles.error} numberOfLines={1}>
          {error}
        </ThemedText>
      ) : null}
    </View>
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
  error: {
    fontSize: 13,
    color: Colors.error,
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 4,
  },
});
