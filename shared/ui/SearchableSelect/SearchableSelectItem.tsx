import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors } from '@/shared/constants/theme';
import type { SelectItem } from './SearchableSelect.types';

const ITEM_HEIGHT = 56;

interface SearchableSelectItemProps {
  item: SelectItem;
  isSelected: boolean;
  onPress: () => void;
}

export const SearchableSelectItem = React.memo(function SearchableSelectItem({
  item,
  isSelected,
  onPress,
}: SearchableSelectItemProps) {
  return (
    <Pressable
      style={[styles.listItem, isSelected && styles.listItemSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}${isSelected ? ', selected' : ''}`}
    >
      <View style={styles.leftContent}>
        {item.leftIcon ? (
          <Text style={styles.leftIcon} numberOfLines={1}>
            {item.leftIcon}
          </Text>
        ) : null}
        <View style={styles.textContent}>
          <Text
            style={[styles.label, isSelected && styles.labelSelected]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
          {item.subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>
        {item.badge && !item.leftIcon ? (
          <Text style={styles.badge} numberOfLines={1}>
            {item.badge}
          </Text>
        ) : null}
      </View>
      {isSelected ? (
        <MaterialIcons
          name="check"
          size={22}
          color={Colors.primary}
          style={styles.checkmark}
        />
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: ITEM_HEIGHT,
    borderRadius: 12,
  },
  listItemSelected: {
    backgroundColor: Colors.greyLow,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leftIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  textContent: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
  },
  labelSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.grey,
    marginTop: 2,
  },
  badge: {
    fontSize: 12,
    color: Colors.grey,
    backgroundColor: Colors.greyHover,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  checkmark: {
    marginLeft: 8,
  },
});
