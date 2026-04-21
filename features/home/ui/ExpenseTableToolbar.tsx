import { useHomeStore } from '@/features/home/model/homeStore';
import { Colors } from '@/shared/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type ExpenseTableToolbarProps = {
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
};

export function ExpenseTableToolbar({
  refreshing,
  onRefresh,
}: ExpenseTableToolbarProps) {
  const expandedIds = useHomeStore((s) => s.expandedIds);
  const collapseAll = useHomeStore((s) => s.collapseAll);
  const hasExpanded = expandedIds.size > 0;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refresh"
        onPress={() => void onRefresh()}
        disabled={refreshing}
        style={({ pressed }) => [
          styles.btn,
          (pressed || refreshing) && styles.btnPressed,
          refreshing && styles.btnDisabled,
        ]}
      >
        <MaterialIcons
          name="refresh"
          size={18}
          color={refreshing ? Colors.grey : Colors.primary}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Collapse categories"
        onPress={() => collapseAll()}
        disabled={!hasExpanded}
        style={({ pressed }) => [
          styles.btn,
          pressed && hasExpanded && styles.btnPressed,
          !hasExpanded && styles.btnDisabled,
        ]}
      >
        <MaterialIcons
          name="unfold-less"
          size={18}
          color={!hasExpanded ? Colors.grey : Colors.primary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.85,
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
