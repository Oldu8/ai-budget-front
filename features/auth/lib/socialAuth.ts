import Constants from 'expo-constants';

import { env } from '@/shared/constants/env';
import type { SocialProvider } from '@/features/auth/types';

/**
 * Result of a native provider sign-in: the id_token to send to our backend,
 * plus an optional display name (Apple only returns it on the very first sign-in).
 */
export interface SocialSignInResult {
  idToken: string;
  name?: string;
}

/** Thrown when a provider's native sign-in is not yet wired up (deps / credentials missing). */
export class SocialAuthNotConfiguredError extends Error {
  constructor(provider: SocialProvider) {
    super(`Social sign-in for "${provider}" is not configured.`);
    this.name = 'SocialAuthNotConfiguredError';
  }
}

/** Thrown when the user dismisses the native sign-in sheet. */
export class SocialAuthCancelledError extends Error {
  constructor() {
    super('Social sign-in was cancelled.');
    this.name = 'SocialAuthCancelledError';
  }
}

/**
 * Master switch for social sign-in UI. Requires a dev/release build (not Expo Go)
 * and provider credentials: Google web/iOS client ids + Apple Developer account
 * with the Sign In with Apple capability on the App ID.
 */
const SOCIAL_AUTH_ENABLED = true;

/** Expo Go ("storeClient") has no custom native modules — Google Sign-In needs a dev build. */
const isExpoGo = Constants.executionEnvironment === 'storeClient';

let googleConfigured = false;

/**
 * Lazy-load the native module so importing this file never crashes Expo Go
 * (where `RNGoogleSignin` isn't in the binary). Returns null if unavailable.
 */
function loadGoogleModule(): typeof import('@react-native-google-signin/google-signin') | null {
  try {
    return require('@react-native-google-signin/google-signin');
  } catch {
    return null;
  }
}

/**
 * Lazy-load expo-apple-authentication so importing this file never crashes
 * Expo Go or Android builds where the module isn't linked.
 */
export function loadAppleModule(): typeof import('expo-apple-authentication') | null {
  try {
    return require('expo-apple-authentication');
  } catch {
    return null;
  }
}

async function getAppleIdToken(): Promise<SocialSignInResult> {
  const apple = loadAppleModule();
  if (!apple) {
    throw new SocialAuthNotConfiguredError('apple');
  }

  try {
    const credential = await apple.signInAsync({
      requestedScopes: [
        apple.AppleAuthenticationScope.FULL_NAME,
        apple.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple sign-in returned no identity token');
    }

    // Apple only provides the name on the very first sign-in; the backend
    // merges it into the account then.
    const name =
      [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ') || undefined;

    return { idToken: credential.identityToken, name };
  } catch (err) {
    if ((err as { code?: string } | null)?.code === 'ERR_REQUEST_CANCELED') {
      throw new SocialAuthCancelledError();
    }
    throw err;
  }
}

/** Obtain a verified id_token from the given provider's native SDK. */
export async function getProviderIdToken(provider: SocialProvider): Promise<SocialSignInResult> {
  if (provider === 'apple') {
    return getAppleIdToken();
  }

  const mod = loadGoogleModule();
  if (!mod || !env.googleWebClientId) {
    throw new SocialAuthNotConfiguredError('google');
  }
  const { GoogleSignin, isErrorWithCode, statusCodes } = mod;

  if (!googleConfigured) {
    GoogleSignin.configure({
      // webClientId becomes the id_token `aud` that our backend verifies.
      webClientId: env.googleWebClientId,
      iosClientId: env.googleIosClientId || undefined,
    });
    googleConfigured = true;
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      throw new SocialAuthCancelledError();
    }

    const idToken = response.data?.idToken;
    if (!idToken) {
      throw new Error('Google sign-in returned no id_token');
    }

    return { idToken, name: response.data?.user?.name ?? undefined };
  } catch (err) {
    if (err instanceof SocialAuthCancelledError) throw err;
    if (isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new SocialAuthCancelledError();
    }
    throw err;
  }
}

/** Whether a provider button should be shown. */
export function isProviderAvailable(provider: SocialProvider, _os: string): boolean {
  // Whole feature is off until after release (see SOCIAL_AUTH_ENABLED).
  if (!SOCIAL_AUTH_ENABLED) return false;
  // Native social sign-in only works in a dev build, not Expo Go.
  if (isExpoGo) return false;
  // Apple is iOS-only.
  if (provider === 'apple') return _os === 'ios';
  return true;
}
