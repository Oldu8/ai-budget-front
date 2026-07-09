import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors } from '@/shared/constants/theme';
import { SearchableSelectItem } from './SearchableSelectItem';
import type { SearchableSelectProps, SelectItem } from './SearchableSelect.types';

const ITEM_HEIGHT = 56;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  autoFocusSearch = false,
  renderTrigger,
}: SearchableSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);

  const handleFullyClosed = useCallback(() => {
    setIsMounted(false);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    if (modalVisible) {
      setIsMounted(true);
      backdropOpacity.value = withTiming(1, { duration: 220 });
      sheetTranslateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    } else if (isMounted) {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 240, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(handleFullyClosed)();
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const filteredItems = useMemo(
    () => items.filter((item) => matchesSearch(item, searchQuery)),
    [items, searchQuery]
  );

  const selectedItem = value ? items.find((i) => i.value === value) : null;

  const closeModal = useCallback(() => {
    setModalVisible(false);
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

  const openModal = useCallback(() => {
    // A text input elsewhere on the screen may still hold focus — hide its
    // keyboard so it doesn't sit over the select sheet.
    Keyboard.dismiss();
    setModalVisible(true);
  }, []);

  const trigger = renderTrigger ? (
    renderTrigger({ onPress: openModal })
  ) : (
    <Pressable
      style={styles.trigger}
      onPress={openModal}
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
  );

  return (
    <View style={styles.container}>
      {trigger}

      {isMounted ? (
        <Modal
          visible
          transparent
          animationType="none"
          onRequestClose={closeModal}
        >
          <Animated.View style={[styles.modalOverlay, backdropAnimatedStyle]}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={closeModal} />
          </Animated.View>

          <Animated.View
            style={[
              styles.modalContent,
              {
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom + 16,
              },
              sheetAnimatedStyle,
            ]}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={Colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={autoFocusSearch}
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
          </Animated.View>
        </Modal>
      ) : null}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
