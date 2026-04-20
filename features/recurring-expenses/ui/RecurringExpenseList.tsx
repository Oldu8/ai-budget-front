import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import type { Category } from '@/entities/category';
import type { RecurringExpense } from '@/features/recurring-expenses/types';
import { RecurringExpenseListItem } from '@/features/recurring-expenses/ui/RecurringExpenseListItem';
import { Colors } from '@/shared/constants/theme';
import { getSubcategoryDisplayLabel } from '@/shared/lib/categoryTree';
import { ThemedText } from '@/shared/ui/ThemedText';

interface RecurringExpenseListProps {
  data: RecurringExpense[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onRefresh: () => void;
  isRefetching: boolean;
  onCreatePress: () => void;
  onItemPress: (id: number) => void;
}

export function RecurringExpenseList({
  data,
  categories,
  isLoading,
  isError,
  onRetry,
  onRefresh,
  isRefetching,
  onCreatePress,
  onItemPress,
}: RecurringExpenseListProps) {
  const { t } = useTranslation();

  const renderItem = useCallback(
    ({ item }: { item: RecurringExpense }) => {
      const subLabel = getSubcategoryDisplayLabel(
        categories,
        item.category_id,
        (key, opts) => t(key, { defaultValue: opts?.defaultValue })
      );
      const title =
        item.label?.trim() ||
        subLabel ||
        t('recurring.untitledExpense');

      return (
        <RecurringExpenseListItem
          expense={item}
          title={title}
          onPress={() => onItemPress(item.id)}
        />
      );
    },
    [categories, onItemPress, t]
  );

  if (isLoading && data.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.errorText}>{t('home.errorTitle')}</ThemedText>
        <Pressable onPress={onRetry} style={styles.retry}>
          <ThemedText type="defaultSemiBold" style={{ color: Colors.primary }}>
            {t('home.errorRetry')}
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={
        data.length === 0 ? styles.emptyContainer : styles.listContent
      }
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <View style={styles.headerRow}>
          <Pressable
            onPress={onCreatePress}
            hitSlop={8}
            style={styles.createBtn}
          >
            <ThemedText type="defaultSemiBold" style={styles.createLabel}>
              + {t('recurring.create')}
            </ThemedText>
          </Pressable>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyInner}>
          <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
            {t('recurring.emptyTitle')}
          </ThemedText>
          <ThemedText style={styles.emptyDesc}>
            {t('recurring.emptyDescription')}
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 12,
  },
  createBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  createLabel: {
    fontSize: 16,
    color: Colors.primary,
  },
  emptyInner: {
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  emptyDesc: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    padding: 12,
  },
});
