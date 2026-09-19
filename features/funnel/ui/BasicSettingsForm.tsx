import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { settingsApi } from '@/features/funnel/api/createSettings';
import { settingsSchema, type SettingsFormData } from '@/features/funnel/lib/settingsSchema';
import { CURRENCY_ITEMS } from '@/shared/constants/currencies';
import { LANGUAGE_ITEMS } from '@/shared/constants/languages';
import { Colors } from '@/shared/constants/theme';
import { TIMEZONE_ITEMS } from '@/shared/constants/timezones';
import { setLanguage, type SupportedLanguage } from '@/shared/i18n';
import { SearchableSelect } from '@/shared/ui/SearchableSelect';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ThemedView } from '@/shared/ui/ThemedView';

const ERROR_SLOT_HEIGHT = 18;

function FieldError({
  show,
  message,
}: {
  show: boolean;
  message?: string;
}) {
  if (!show || !message) return null;
  return (
    <ThemedText style={styles.errorText} numberOfLines={1}>
      {message}
    </ThemedText>
  );
}

export function BasicSettingsForm() {
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: 'onSubmit',
    defaultValues: {
      currency: '',
      language: '',
      timezone: '',
    },
  });

  const showError = (field: keyof SettingsFormData) => errors[field] && isSubmitted;

  const onSubmit = async (data: SettingsFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const settings = await settingsApi.create({
        currency: data.currency,
        language: data.language,
        timezone: data.timezone,
      });
      useUserStore.getState().setUserData({
        user: user ?? null,
        settings,
      });
      setLanguage(data.language as SupportedLanguage);
      router.push('/(funnel)/visibility-questions');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isSubmitting;

  return (
    <ThemedView style={styles.form}>
      <Controller
        control={control}
        name="currency"
        render={({ field: { onChange, value } }) => (
          <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>Currency</ThemedText>
            <SearchableSelect
              items={CURRENCY_ITEMS}
              value={value || null}
              placeholder="Select currency"
              onChange={(v) => {
                clearErrors('currency');
                onChange(v);
              }}
            />
            <View style={styles.errorSlot}>
              <FieldError
                show={!!showError('currency')}
                message={errors.currency?.message}
              />
            </View>
          </ThemedView>
        )}
      />

      <Controller
        control={control}
        name="language"
        render={({ field: { onChange, value } }) => (
          <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>Language</ThemedText>
            <SearchableSelect
              items={LANGUAGE_ITEMS}
              value={value || null}
              placeholder="Select language"
              onChange={(v) => {
                clearErrors('language');
                onChange(v);
              }}
            />
            <View style={styles.errorSlot}>
              <FieldError
                show={!!showError('language')}
                message={errors.language?.message}
              />
            </View>
          </ThemedView>
        )}
      />

      <Controller
        control={control}
        name="timezone"
        render={({ field: { onChange, value } }) => (
          <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>Timezone</ThemedText>
            <SearchableSelect
              items={TIMEZONE_ITEMS}
              value={value || null}
              placeholder="Select timezone"
              onChange={(v) => {
                clearErrors('timezone');
                onChange(v);
              }}
            />
            <View style={styles.errorSlot}>
              <FieldError
                show={!!showError('timezone')}
                message={errors.timezone?.message}
              />
            </View>
          </ThemedView>
        )}
      />

      {submitError ? (
        <ThemedText style={styles.submitError}>{submitError}</ThemedText>
      ) : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
  },
  field: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grey,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.greyHover,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.black,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorSlot: {
    height: ERROR_SLOT_HEIGHT,
    justifyContent: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
  },
  submitError: {
    fontSize: 13,
    color: Colors.error,
    marginTop: 4,
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
});
