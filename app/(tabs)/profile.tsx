import { ThemedText } from '@/shared/ui/ThemedText';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { Colors } from '@/shared/constants/theme';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

function displayName(firstName: string | null, lastName: string | null): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length ? parts.join(' ') : '';
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthContext();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  //TODO: add cashing
  const name = user ? displayName(user.first_name, user.last_name) : '';

  return (
    <ScreenContainer variant="default">
      <View style={styles.topBlock}>
        {name ? (
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {name}
          </ThemedText>
        ) : null}
        {user?.email ? (
          <ThemedText style={[styles.email, !name && styles.emailOnly]}>
            {user.email}
          </ThemedText>
        ) : null}
      </View>

      <Pressable
        style={[styles.logoutButton, isSigningOut && styles.logoutButtonDisabled]}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <ThemedText style={styles.logoutButtonText}>{t('profile.logout')}</ThemedText>
        )}
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.grey,
  },
  emailOnly: {
    marginTop: 0,
  },
  logoutButton: {
    alignSelf: 'center',
    marginBottom: 32,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
