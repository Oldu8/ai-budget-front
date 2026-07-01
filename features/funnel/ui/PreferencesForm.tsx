import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { protectedPatch } from '@/shared/api/protectedClient';
import type { VisibilityQuestion } from '@/features/funnel/api/getVisibilityQuestions';
import {
  DEFAULT_ICON,
  PREFERENCES_ICONS,
} from '@/features/funnel/lib/preferencesIcons';
import type { PreferenceAnswers } from '@/features/funnel/types';
import { useVisibilityQuestionsQuery } from '@/features/funnel/model/useVisibilityQuestionsQuery';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

import { PreferenceRow } from './PreferenceRow';

function getTranslationBase(question: VisibilityQuestion): string {
  return (
    question.translation_key ?? `onboarding.preferences.${question.question_key}`
  );
}

function getTranslatedTitle(t: (key: string) => string, question: VisibilityQuestion): string {
  const key = `${getTranslationBase(question)}.title`;
  const translated = t(key);
  return translated === key ? question.label : translated;
}

function getTranslatedDescription(
  t: (key: string) => string,
  question: VisibilityQuestion
): string {
  const key = `${getTranslationBase(question)}.description`;
  const translated = t(key);
  return translated === key ? '' : translated;
}

export interface PreferencesFormProps {
  submitLabel: string;
  showSkip?: boolean;
  skipLabel?: string;
  onSuccess?: () => void;
  onSkip?: () => void;
  /** When provided, used as initial answers instead of defaulting all to false. */
  initialAnswers?: PreferenceAnswers;
}

export function PreferencesForm({
  submitLabel,
  showSkip = false,
  skipLabel,
  onSuccess,
  onSkip,
  initialAnswers: initialAnswersProp,
}: PreferencesFormProps) {
  const { t } = useTranslation();
  const { data: questions, isLoading, error } = useVisibilityQuestionsQuery();
  const [answers, setAnswers] = useState<PreferenceAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultInitialAnswers = useMemo(() => {
    if (!questions) return {};
    return questions.reduce<PreferenceAnswers>((acc, q) => {
      acc[q.question_key] = false;
      return acc;
    }, {});
  }, [questions]);

  const initialAnswers = useMemo(
    () => ({ ...defaultInitialAnswers, ...(initialAnswersProp ?? {}) }),
    [defaultInitialAnswers, initialAnswersProp]
  );

  const mergedAnswers = useMemo(
    () => ({ ...initialAnswers, ...answers }),
    [initialAnswers, answers]
  );

  const handleToggle = useCallback((questionKey: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!questions) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      // De-duplicate by visibility_tag (last one wins) and send the full
      // current state in a single request instead of one request per question.
      const preferences = Array.from(
        questions
          .reduce((acc, q) => {
            acc.set(q.visibility_tag, {
              visibility_tag: q.visibility_tag,
              enabled: mergedAnswers[q.question_key] ?? false,
            });
            return acc;
          }, new Map<string, { visibility_tag: string; enabled: boolean }>())
          .values()
      );

      await protectedPatch('/api/me/category-visibility', { preferences });
      onSuccess?.();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [questions, mergedAnswers, onSuccess]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <ThemedText style={styles.error}>
        {error instanceof Error ? error.message : 'Failed to load questions'}
      </ThemedText>
    );
  }

  return (
    <View style={styles.form}>
      {questions?.map((question) => (
        <PreferenceRow
          key={question.question_key}
          icon={PREFERENCES_ICONS[question.visibility_tag] ?? DEFAULT_ICON}
          title={getTranslatedTitle(t, question)}
          description={getTranslatedDescription(t, question)}
          value={mergedAnswers[question.question_key] ?? false}
          onToggle={(value) => handleToggle(question.question_key, value)}
        />
      ))}

      {submitError ? (
        <ThemedText style={styles.submitError}>{submitError}</ThemedText>
      ) : null}

      <Pressable
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>{submitLabel}</ThemedText>
        )}
      </Pressable>

      {showSkip && onSkip ? (
        <Pressable
          style={styles.skipButton}
          onPress={onSkip}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.skipText}>{skipLabel ?? ''}</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 0,
  },
  loaderContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: Colors.error,
    marginTop: 24,
  },
  submitError: {
    fontSize: 13,
    color: Colors.error,
    marginTop: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  skipText: {
    fontSize: 16,
    color: Colors.grey,
  },
});
