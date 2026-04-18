import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function NotificationsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={[]}>
        <View style={styles.content}>
          <ThemedText style={styles.description}>
            {t('profile.notificationsDescription', 'Configure push notifications and email alerts. Coming soon.')}
          </ThemedText>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
  },
});
