import { NativeModules, Platform } from 'react-native';

/**
 * Firebase Crashlytics is a native module: it only exists in a Dev/EAS build,
 * never in Expo Go or on web. Its JS wrapper throws as soon as it's imported
 * (not just when called) if the native module isn't linked, so we only
 * `require` it once we've confirmed the native side actually exists — a plain
 * top-level `import` would crash Expo Go before any try/catch could run.
 * Every call is still wrapped so crash reporting stays strictly best-effort
 * and invisible to the user. Mirrors shared/analytics/analytics.ts.
 */
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
const isFirebaseLinked = isNative && NativeModules.RNFBAppModule != null;

let crashlytics: typeof import('@react-native-firebase/crashlytics').default | null = null;
if (isFirebaseLinked) {
  try {
    crashlytics = require('@react-native-firebase/crashlytics').default;
  } catch {
    crashlytics = null;
  }
}

/**
 * `log`/`recordError` return void (fire-and-forget); `setUserId` returns a Promise.
 * Handles both so a rejected promise never surfaces as an unhandled rejection.
 */
function report(fn: (getCrashlytics: NonNullable<typeof crashlytics>) => void | Promise<unknown>): void {
  if (!crashlytics) return;
  try {
    const result = fn(crashlytics);
    if (result && typeof result.catch === 'function') {
      void result.catch(() => {
        /* swallow SDK errors */
      });
    }
  } catch {
    // Defensive: shouldn't happen since crashlytics is only set once linked.
  }
}

/**
 * Single entry point for crash reporting. Native crashes are captured by the
 * SDK automatically; this covers the JS side — uncaught errors (wired up in
 * setupCrashReporting) and errors you record manually from a catch block.
 */
export const Crashlytics = {
  /** Ties later crash reports to a user across sessions. Pass null on sign-out. */
  setUser(userId: string | null) {
    report((getCrashlytics) => getCrashlytics().setUserId(userId ?? ''));
  },

  /** Breadcrumb: shows up in the crash timeline leading up to a report. */
  log(message: string) {
    report((getCrashlytics) => getCrashlytics().log(message));
  },

  /** Records a non-fatal error with its stack trace. `context` becomes a breadcrumb. */
  recordError(error: unknown, context?: string) {
    report((getCrashlytics) => {
      const err = error instanceof Error ? error : new Error(String(error));
      if (context) getCrashlytics().log(context);
      return getCrashlytics().recordError(err);
    });
  },
};
