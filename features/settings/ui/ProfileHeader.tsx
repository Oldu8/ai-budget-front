import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import type { AppUser } from '@/entities/user';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

import { InitialsAvatar } from './InitialsAvatar';

function displayName(firstName: string | null, lastName: string | null): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length ? parts.join(' ') : '';
}

export interface ProfileHeaderProps {
  user: AppUser | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const name = user ? displayName(user.first_name, user.last_name) : '';
  const displayNameOrFallback = name || (user ? t('profile.userFallback') : '');
  const email = user?.email ?? '';

  return (
    <View style={styles.container}>
      <InitialsAvatar
        firstName={user?.first_name ?? null}
        lastName={user?.last_name ?? null}
      />
      {displayNameOrFallback ? (
        <ThemedText type="defaultSemiBold" style={styles.name}>
          {displayNameOrFallback}
        </ThemedText>
      ) : null}
      {email ? (
        <ThemedText style={[styles.email, !displayNameOrFallback && styles.emailOnly]}>
          {email}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: Colors.grey,
  },
  emailOnly: {
    marginTop: 0,
  },
});
