import { Redirect } from 'expo-router';

/**
 * Cold-start entry so the root stack does not resolve to an auxiliary group
 * (e.g. recurring) when the host picks a non-tab initial route.
 */
export default function RootIndex() {
  return <Redirect href="/(tabs)" />;
}
