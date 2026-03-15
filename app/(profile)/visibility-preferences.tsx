import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { PreferencesForm } from '@/features/funnel/ui/PreferencesForm';
import {
  mapVisibilityTagsToAnswers,
  useVisibilityTagsQuery,
} from '@/features/funnel/model/useVisibilityTagsQuery';
import { useVisibilityQuestionsQuery } from '@/features/funnel/model/useVisibilityQuestionsQuery';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function VisibilityPreferencesScreen() {
  const { t } = useTranslation();
  const { data: questions, isLoading: questionsLoading } =
    useVisibilityQuestionsQuery();
  const { data: tags, isLoading: tagsLoading, isError: tagsError } =
    useVisibilityTagsQuery();

  const initialAnswers = useMemo(() => {
    if (!questions) return undefined;
    if (tags && !tagsError) return mapVisibilityTagsToAnswers(tags, questions);
    return undefined;
  }, [questions, tags, tagsError]);

  const isLoading = questionsLoading || tagsLoading;

  if (isLoading) {
    return (
      <ScreenContainer variant="default">
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="default">
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.description}>
          {t('onboarding.preferences.description')}
        </ThemedText>

        <PreferencesForm
          submitLabel={t('buttons.save')}
          onSuccess={() => router.back()}
          initialAnswers={initialAnswers}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 24,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.grey,
    marginBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
