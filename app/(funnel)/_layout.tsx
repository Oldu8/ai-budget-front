import { Stack } from 'expo-router';

export default function FunnelLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings" />
      <Stack.Screen name="visibility-questions" />
    </Stack>
  );
}
