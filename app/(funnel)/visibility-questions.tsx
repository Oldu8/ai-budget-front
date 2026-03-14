import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/shared/ui/ThemedText';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { useVisibilityQuestionsQuery } from '@/features/funnel/model/useVisibilityQuestionsQuery';
import { Colors } from '@/shared/constants/theme';

export default function VisibilityQuestionsScreen() {
  const { data, isLoading, error } = useVisibilityQuestionsQuery();

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer variant="default">
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Visibility Questions
        </ThemedText>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : error ? (
          <ThemedText style={styles.error}>
            {error instanceof Error ? error.message : 'Failed to load questions'}
          </ThemedText>
        ) : data ? (
          <ThemedText style={styles.content}>
            {typeof data === 'string'
              ? data
              : Array.isArray(data)
                ? JSON.stringify(data, null, 2)
                : JSON.stringify(data, null, 2)}
          </ThemedText>
        ) : null}

        <Pressable style={styles.button} onPress={handleFinish}>
          <ThemedText style={styles.buttonText}>Finish</ThemedText>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    marginTop: 48,
    marginBottom: 32,
  },
  loader: {
    marginVertical: 24,
  },
  error: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 24,
  },
  content: {
    fontSize: 14,
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
