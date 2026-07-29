import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { setAuthErrorHandler } from '@/shared/api/protectedClient';
import { clearTokens } from '@/shared/storage/tokenStorage';
import { useAuth } from '@/features/auth/model/useAuth';
import { useUserStore } from '@/features/auth/model/useUserStore';
import { configureRevenueCat, logOutRevenueCat } from '@/features/billing';
import {
  setLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from '@/shared/i18n';
import { ThemedView } from '@/shared/ui/ThemedView';
import { Colors } from '@/shared/constants/theme';

type AuthContextValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { status, settings, user } = auth;
  const routerRef = useRef(router);
  routerRef.current = router;
  const prevStatusRef = useRef(status);

  /**
   * Gates the full-screen spinner to the initial session check only. Without this,
   * `status === 'loading'` during a login/signup submit would unmount `children`
   * (including the auth screens), wiping local form state on failure (e.g. wrong
   * password clearing the email/password fields).
   */
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  useEffect(() => {
    auth.bootstrapAuth();
  }, []);

  useEffect(() => {
    if (!hasBootstrapped && (status === 'authenticated' || status === 'unauthenticated')) {
      setHasBootstrapped(true);
    }
  }, [status, hasBootstrapped]);

  // Apply the saved language whenever settings arrive (bootstrap, login, funnel,
  // profile update) — i18n itself always starts in "en".
  const savedLanguage = settings?.language;
  useEffect(() => {
    if (
      savedLanguage &&
      (supportedLanguages as readonly string[]).includes(savedLanguage)
    ) {
      setLanguage(savedLanguage as SupportedLanguage);
    }
  }, [savedLanguage]);

  // Identify the RevenueCat customer with our own user id (iOS only) so the webhook
  // on the backend can match purchases straight to app_users. No-op on web/Android.
  useEffect(() => {
    if (status === 'authenticated' && user?.id) {
      configureRevenueCat(String(user.id));
    }
    if (prevStatusRef.current === 'authenticated' && status === 'unauthenticated') {
      logOutRevenueCat();
    }
    prevStatusRef.current = status;
  }, [status, user?.id]);

  useEffect(() => {
    setAuthErrorHandler(async () => {
      await clearTokens();
      useUserStore.getState().resetAuth();
      routerRef.current.replace('/(auth)/login');
    });
    return () => setAuthErrorHandler(null);
  }, []);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return;
    const segs = segments as readonly string[];
    const inAuthGroup =
      segs[0] === '(auth)' || segs.includes('login') || segs.includes('signup');
    const inTabsGroup = segs[0] === '(tabs)';

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (status === 'authenticated') {
      if (inAuthGroup) {
        router.replace(settings ? '/(tabs)' : '/(funnel)/settings');
        return;
      }
      if (inTabsGroup && !settings) {
        router.replace('/(funnel)/settings');
      }
    }
  }, [status, segments, settings]);

  if (!hasBootstrapped) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ThemedView>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
