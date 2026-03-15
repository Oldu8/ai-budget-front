import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { meUpdateApi } from '@/features/auth/api/updateMe';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useUserStore } from '@/features/auth/model/useUserStore';
import {
  editProfileSchema,
  type EditProfileFormData,
} from '@/features/settings/lib/editProfileSchema';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

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

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    clearErrors,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onSubmit',
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
      });
    }
  }, [user, reset]);

  const showError = (field: keyof EditProfileFormData) =>
    errors[field] && isSubmitted;

  const onSubmit = async (data: EditProfileFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await meUpdateApi.updateMe({
        first_name: data.first_name,
        last_name: data.last_name,
      });
      useUserStore.getState().setUserData({
        user: user
          ? { ...user, first_name: data.first_name, last_name: data.last_name }
          : null,
      });
      router.back();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <View style={styles.form}>
            <Controller
              control={control}
              name="first_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.field}>
                  <ThemedText style={styles.label}>
                    {t('profile.editProfileFirstName', 'First name')}
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      showError('first_name') && styles.inputError,
                    ]}
                    placeholder={t('profile.editProfileFirstNamePlaceholder', 'Enter first name')}
                    placeholderTextColor={Colors.grey}
                    value={value}
                    onChangeText={(v) => {
                      clearErrors('first_name');
                      onChange(v);
                    }}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    editable={!isSubmitting}
                  />
                  <View style={styles.errorSlot}>
                    <FieldError
                      show={!!showError('first_name')}
                      message={errors.first_name?.message}
                    />
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="last_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.field}>
                  <ThemedText style={styles.label}>
                    {t('profile.editProfileLastName', 'Last name')}
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      showError('last_name') && styles.inputError,
                    ]}
                    placeholder={t('profile.editProfileLastNamePlaceholder', 'Enter last name')}
                    placeholderTextColor={Colors.grey}
                    value={value}
                    onChangeText={(v) => {
                      clearErrors('last_name');
                      onChange(v);
                    }}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    editable={!isSubmitting}
                  />
                  <View style={styles.errorSlot}>
                    <FieldError
                      show={!!showError('last_name')}
                      message={errors.last_name?.message}
                    />
                  </View>
                </View>
              )}
            />

            {submitError ? (
              <ThemedText style={styles.submitError}>{submitError}</ThemedText>
            ) : null}

            <Pressable
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>{t('buttons.save')}</ThemedText>
              )}
            </Pressable>
          </View>
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
    paddingTop: 24,
    paddingBottom: 24,
  },
  form: {
    gap: 0,
  },
  field: {
    marginBottom: 16,
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
    marginTop: 24,
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
