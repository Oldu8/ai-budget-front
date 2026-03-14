/**
 * Env variables (EXPO_PUBLIC_*) are loaded by Expo from:
 * .env, .env.local, .env.production (later override earlier).
 * Copy .env.example to .env or .env.local and fill values.
 */

/** Base API URL without trailing slash (avoids //api in paths). */
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';

export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
  /** When set, sent as X-API-Key header. Required if backend has API_SECRET. */
  apiSecret: process.env.EXPO_PUBLIC_API_SECRET ?? '',
} as const;
