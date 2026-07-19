import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { isProviderAvailable, loadAppleModule } from '@/features/auth/lib/socialAuth';
import type { SocialProvider } from '@/features/auth/types';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

const GOOGLE_LOGO = require('../../../assets/images/social/google-auth.png');
/** Source asset is 525×120. */
const GOOGLE_LOGO_ASPECT = 525 / 120;
const BUTTON_HEIGHT = 52;
const BUTTON_RADIUS = 12;

// Apple's own branded native button (required look per HIG). Null in Expo Go /
// Android, where the Apple button isn't shown anyway.
const AppleAuth = loadAppleModule();

export function SocialAuthButtons({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const { signInWithProvider } = useAuthContext();
  const [pending, setPending] = useState<SocialProvider | null>(null);

  const providers = (['google', 'apple'] as const).filter((p) =>
    isProviderAvailable(p, Platform.OS),
  );

  if (providers.length === 0) return null;

  const onPress = async (provider: SocialProvider) => {
    setPending(provider);
    try {
      await signInWithProvider(provider);
    } catch {
      // Error is surfaced via the shared auth error state.
    } finally {
      setPending(null);
    }
  };

  const blocked = disabled || pending !== null;

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <ThemedText style={styles.dividerText}>{t('auth.orDivider')}</ThemedText>
        <View style={styles.divider} />
      </View>

      {providers.map((provider) =>
        provider === 'google' ? (
          <Pressable
            key="google"
            style={[styles.button, styles.googleButton, blocked && styles.buttonDisabled]}
            onPress={() => onPress('google')}
            disabled={blocked}
            accessibilityRole="button"
            accessibilityLabel={t('auth.continueWithGoogle')}
          >
            {pending === 'google' ? (
              <ActivityIndicator color={Colors.black} size="small" />
            ) : (
              <Image source={GOOGLE_LOGO} style={styles.googleLogo} contentFit="contain" />
            )}
          </Pressable>
        ) : pending === 'apple' ? (
          <View key="apple" style={[styles.button, styles.appleButton]}>
            <ActivityIndicator color={Colors.white} size="small" />
          </View>
        ) : AppleAuth ? (
          <View key="apple" pointerEvents={blocked ? 'none' : 'auto'}>
            <AppleAuth.AppleAuthenticationButton
              buttonType={AppleAuth.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={AppleAuth.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={BUTTON_RADIUS}
              style={[styles.button, blocked && styles.buttonDisabled]}
              onPress={() => onPress('apple')}
            />
          </View>
        ) : (
          <Pressable
            key="apple"
            style={[styles.button, styles.appleButton, blocked && styles.buttonDisabled]}
            onPress={() => onPress('apple')}
            disabled={blocked}
            accessibilityRole="button"
            accessibilityLabel={t('auth.continueWithApple')}
          >
            <Ionicons name="logo-apple" size={20} color={Colors.white} style={styles.appleIcon} />
            <ThemedText style={styles.appleText}>{t('auth.continueWithApple')}</ThemedText>
          </Pressable>
        ),
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
  // Shared size/shape so Google and Apple match exactly.
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
  googleButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyHover,
  },
  googleLogo: {
    height: 22,
    aspectRatio: GOOGLE_LOGO_ASPECT,
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
