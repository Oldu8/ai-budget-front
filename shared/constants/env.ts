/**
 * Env variables (EXPO_PUBLIC_*) are loaded by Expo from:
 * .env, .env.local, .env.production (later override earlier).
 * Copy .env.example to .env or .env.local and fill values.
 */

export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
} as const;
