import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function ExportDataScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer variant="default">
      <View style={styles.content}>
        <ThemedText style={styles.description}>
          {t('profile.exportDataDescription', 'Export your budget data as CSV. Coming soon.')}
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
  },
});
