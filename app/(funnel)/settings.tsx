import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/shared/ui/ThemedText';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { BasicSettingsForm } from '@/features/funnel/ui/BasicSettingsForm';

export default function FunnelSettingsScreen() {
  return (
    <ScreenContainer variant="default">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Basic Settings
          </ThemedText>
          <BasicSettingsForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  title: {
    marginTop: 40,
    marginBottom: 28,
  },
});
