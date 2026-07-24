import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { z } from 'zod';

import { ApiError } from '@/shared/api/client';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { PasswordInput } from '@/features/auth/ui/PasswordInput';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

const schema = z
  .object({
    current_password: z.string().min(1).max(128),
    new_password: z.string().min(6).max(128),
    confirm_password: z.string().min(1).max(128),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    path: ['confirm_password'],
    message: 'mismatch',
  });

type FormData = z.infer<typeof schema>;

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const { changePassword } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await changePassword(data.current_password, data.new_password);
      setSuccess(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setSubmitError(t('auth.changePassword.errorCurrentIncorrect'));
        } else if (err.status === 409) {
          setSubmitError(t('auth.changePassword.errorNoPassword'));
        } else {
          setSubmitError(t('auth.changePassword.errorGeneric'));
        }
      } else {
        setSubmitError(t('auth.changePassword.errorGeneric'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: { name: keyof FormData; label: string; placeholder: string }[] = [
    {
      name: 'current_password',
      label: t('auth.changePassword.currentLabel'),
      placeholder: t('auth.changePassword.currentPlaceholder'),
    },
    {
      name: 'new_password',
      label: t('auth.changePassword.newLabel'),
      placeholder: t('auth.changePassword.newPlaceholder'),
    },
    {
      name: 'confirm_password',
      label: t('auth.changePassword.confirmLabel'),
      placeholder: t('auth.changePassword.confirmPlaceholder'),
    },
  ];

  const fieldError = (name: keyof FormData): string | undefined => {
    if (name === 'confirm_password' && errors.confirm_password?.message === 'mismatch') {
      return t('auth.changePassword.errorMismatch');
    }
    return undefined;
  };

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={[]}>
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
            <View style={styles.form}>
              {fields.map((f) => (
                <Controller
                  key={f.name}
                  control={control}
                  name={f.name}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                      label={f.label}
                      placeholder={f.placeholder}
                      value={value}
                      onChangeText={(v) => {
                        clearErrors(f.name);
                        if (submitError) setSubmitError(null);
                        onChange(v);
                      }}
                      onBlur={onBlur}
                      error={fieldError(f.name)}
                      editable={!isSubmitting}
                      autoCapitalize="none"
                      maxLength={128}
                    />
                  )}
                />
              ))}

              {submitError ? (
                <ThemedText style={styles.submitError}>{submitError}</ThemedText>
              ) : null}
              {success ? (
                <ThemedText style={styles.success}>
                  {t('auth.changePassword.success')}
                </ThemedText>
              ) : null}

              <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    {t('auth.changePassword.submit')}
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  form: { gap: 16, paddingTop: 8 },
  submitError: { fontSize: 13, color: Colors.error, marginTop: -4 },
  success: { fontSize: 13, color: Colors.primary, marginTop: -4 },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
