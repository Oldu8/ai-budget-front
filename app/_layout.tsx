import '../global.css';

import '@/shared/i18n';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { BillingReturnListener, PaywallSheet } from '@/features/billing';
import { setupCrashReporting } from '@/shared/crashlytics';
import { ToastOverlay, ToastProvider } from '@/shared/ui/Toast';

export const unstable_settings = {
  /** Full path: bare `(tabs)` is unreliable; see Expo Router `initialRouteName` / root stack. */
  initialRouteName: 'index',
};

setupCrashReporting();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <ToastProvider>
            <View style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(funnel)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(profile)" options={{ headerShown: false }} />
                <Stack.Screen name="(add)" options={{ headerShown: false }} />
                <Stack.Screen name="(recurring)" options={{ headerShown: false }} />
              </Stack>
              <PaywallSheet />
              <BillingReturnListener />
              <ToastOverlay />
            </View>
            <StatusBar style="dark" />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
