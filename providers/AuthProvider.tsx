import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { setAuthErrorHandler } from '@/lib/auth/apiClient';
import { clearTokens } from '@/lib/auth/tokenStorage';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/stores/useUserStore';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

type AuthContextValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { status } = auth;
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
    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === '(auth)';
    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments]);

  // Full-screen loader while bootstrapAuth runs so we don't flash auth vs app stack.
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
