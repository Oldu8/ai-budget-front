import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { setAuthErrorHandler } from '@/shared/api/protectedClient';
import { clearTokens } from '@/shared/storage/tokenStorage';
import { useAuth } from '@/features/auth/model/useAuth';
import { useUserStore } from '@/features/auth/model/useUserStore';
import { ThemedView } from '@/shared/ui/ThemedView';
import { Colors } from '@/shared/constants/theme';

type AuthContextValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { status, settings } = auth;
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    auth.bootstrapAuth();
  }, []);

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

  if (status === 'idle' || status === 'loading') {
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
