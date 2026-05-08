import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

export type HomeViewMode = 'table' | 'analytics';

type HomeViewModeSwitcherProps = {
  viewMode: HomeViewMode;
  onSelectTable: () => void;
  onSelectAnalytics: () => void;
};

export function HomeViewModeSwitcher({
  viewMode,
  onSelectTable,
  onSelectAnalytics,
}: HomeViewModeSwitcherProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <ThemedView style={styles.track}>
        <Pressable
          onPress={onSelectTable}
          style={[
            styles.segment,
            viewMode === 'table' ? styles.segmentActive : styles.segmentIdle,
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: viewMode === 'table' }}
        >
          <ThemedText
            style={
              viewMode === 'table' ? styles.segmentLabelActive : styles.segmentLabelIdle
            }
          >
            {t('home.view.table')}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={onSelectAnalytics}
          style={[
            styles.segment,
            viewMode === 'analytics' ? styles.segmentActive : styles.segmentIdle,
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: viewMode === 'analytics' }}
        >
          <ThemedText
            style={
              viewMode === 'analytics'
                ? styles.segmentLabelActive
                : styles.segmentLabelIdle
            }
          >
            {t('home.view.analytics')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  track: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  segment: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  segmentIdle: {
    backgroundColor: Colors.white,
  },
  segmentLabelActive: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  segmentLabelIdle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});
