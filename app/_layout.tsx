import '../global.css';

import '@/shared/i18n';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { PaywallSheet } from '@/features/billing';
import { ToastOverlay, ToastProvider } from '@/shared/ui/Toast';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <ToastProvider>
            <View style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(funnel)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(profile)" options={{ headerShown: false }} />
                <Stack.Screen name="(add)" options={{ headerShown: false }} />
                <Stack.Screen name="(recurring)" options={{ headerShown: false }} />
              </Stack>
              <PaywallSheet />
              <ToastOverlay />
            </View>
            <StatusBar style="dark" />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
