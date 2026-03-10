import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmailInput } from '@/components/ui/EmailInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useAuthContext } from '@/providers/AuthProvider';
import { Colors } from '@/constants/theme';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const { t } = useTranslation();
  const { signUp, status, error, setError } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password);
    } catch {
      // Error stored in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = status === 'loading' || isSubmitting;

  return (
    <ScreenContainer variant="default">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ThemedText type="title" style={styles.title}>
          {t('auth.signupTitle')}
        </ThemedText>

        <ThemedView style={styles.form}>
          <EmailInput
            label={t('auth.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChangeText={(v) => setValue('email', v, { shouldValidate: true })}
            error={errors.email?.message}
            editable={!loading}
          />

          <PasswordInput
            label={t('auth.passwordLabel')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChangeText={(v) => setValue('password', v, { shouldValidate: true })}
            error={errors.password?.message}
            editable={!loading}
          />

          {error ? (
            <ThemedText style={styles.errorText}>{t(error)}</ThemedText>
          ) : null}

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <ThemedText style={styles.buttonText}>{t('auth.signupButton')}</ThemedText>
            )}
          </Pressable>

          <Pressable
            style={styles.link}
            onPress={() => router.replace('/(auth)/login' as never)}
            disabled={loading}
          >
            <ThemedText type="link">{t('auth.toLogin')}</ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  title: {
    marginTop: 48,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
    marginTop: -4,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    alignSelf: 'center',
    marginTop: 16,
  },
});
