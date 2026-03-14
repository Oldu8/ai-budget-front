import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors } from '@/shared/constants/theme';
import { SearchableSelectItem } from './SearchableSelectItem';
import type { SearchableSelectProps, SelectItem } from './SearchableSelect.types';

const ITEM_HEIGHT = 56;

function matchesSearch(item: SelectItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.label.toLowerCase().includes(q)) return true;
  if (item.value.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
  return false;
}

export function SearchableSelect({
  items,
  value,
  placeholder,
  onChange,
}: SearchableSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filteredItems = useMemo(
    () => items.filter((item) => matchesSearch(item, searchQuery)),
    [items, searchQuery]
  );

  const selectedItem = value ? items.find((i) => i.value === value) : null;

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSearchQuery('');
  }, []);

  const handleSelect = useCallback(
    (item: SelectItem) => {
      onChange(item.value);
      closeModal();
    },
    [onChange, closeModal]
  );

  const renderItem = useCallback(
    ({ item }: { item: SelectItem }) => (
      <SearchableSelectItem
        item={item}
        isSelected={item.value === value}
        onPress={() => handleSelect(item)}
      />
    ),
    [value, handleSelect]
  );

  const keyExtractor = useCallback((item: SelectItem) => item.value, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        accessibilityRole="combobox"
        accessibilityLabel={
          selectedItem ? selectedItem.label : placeholder || 'Select an option'
        }
      >
        <View style={styles.triggerContent}>
          {selectedItem?.leftIcon ? (
            <Text style={styles.triggerLeftIcon}>{selectedItem.leftIcon}</Text>
          ) : selectedItem?.badge ? (
            <View style={styles.triggerBadge}>
              <Text style={styles.triggerBadgeText}>{selectedItem.badge}</Text>
            </View>
          ) : null}
          <View style={styles.triggerTextWrap}>
            <Text
              style={[
                styles.triggerText,
                !value && styles.triggerPlaceholder,
              ]}
              numberOfLines={1}
            >
              {selectedItem?.label ?? placeholder ?? ''}
            </Text>
            {selectedItem?.subtitle && value ? (
              <Text style={styles.triggerSubtitle} numberOfLines={1}>
                {selectedItem.subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color={Colors.grey}
          style={styles.chevron}
        />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable
            style={[
              styles.modalContent,
              {
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom + 16,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={Colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Search options"
              {...(Platform.OS === 'web' && { outlineStyle: 'none' })}
            />

            <FlatList
              data={filteredItems}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <MaterialIcons
                    name="search-off"
                    size={32}
                    color={Colors.grey}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.greyHover,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.greyLow,
    minHeight: 48,
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  triggerLeftIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  triggerBadge: {
    backgroundColor: Colors.greyHover,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  triggerBadgeText: {
    fontSize: 12,
    color: Colors.grey,
    fontWeight: '500',
  },
  triggerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  triggerText: {
    fontSize: 16,
    color: Colors.black,
  },
  triggerPlaceholder: {
    color: Colors.grey,
  },
  triggerSubtitle: {
    fontSize: 13,
    color: Colors.grey,
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingHorizontal: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.greyHover,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.black,
    marginBottom: 12,
  },
  list: {
    flexGrow: 0,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grey,
  },
});
