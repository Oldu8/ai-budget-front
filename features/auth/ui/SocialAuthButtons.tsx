import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { isProviderAvailable, loadAppleModule } from '@/features/auth/lib/socialAuth';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

const BUTTON_HEIGHT = 52;
const BUTTON_RADIUS = 12;

// Apple's own branded native button (required look per HIG). Null in Expo Go /
// Android, where the Apple button isn't shown anyway.
const AppleAuth = loadAppleModule();

export function SocialAuthButtons({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const { signInWithProvider } = useAuthContext();
  const [pending, setPending] = useState(false);

  if (!isProviderAvailable('apple', Platform.OS)) return null;

  const onPress = async () => {
    setPending(true);
    try {
      await signInWithProvider('apple');
    } catch {
      // Error is surfaced via the shared auth error state.
    } finally {
      setPending(false);
    }
  };

  const blocked = disabled || pending;

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <ThemedText style={styles.dividerText}>{t('auth.orDivider')}</ThemedText>
        <View style={styles.divider} />
      </View>

      {pending ? (
        <View style={[styles.button, styles.appleButton]}>
          <ActivityIndicator color={Colors.white} size="small" />
        </View>
      ) : AppleAuth ? (
        <View pointerEvents={blocked ? 'none' : 'auto'}>
          <AppleAuth.AppleAuthenticationButton
            buttonType={AppleAuth.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuth.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={BUTTON_RADIUS}
            style={[styles.button, blocked && styles.buttonDisabled]}
            onPress={onPress}
          />
        </View>
      ) : (
        <Pressable
          style={[styles.button, styles.appleButton, blocked && styles.buttonDisabled]}
          onPress={onPress}
          disabled={blocked}
          accessibilityRole="button"
          accessibilityLabel={t('auth.continueWithApple')}
        >
          <Ionicons name="logo-apple" size={20} color={Colors.white} style={styles.appleIcon} />
          <ThemedText style={styles.appleText}>{t('auth.continueWithApple')}</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.greyHover,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.grey,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  appleButton: {
    backgroundColor: Colors.black,
  },
  appleIcon: {
    marginRight: 10,
  },
  appleText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
