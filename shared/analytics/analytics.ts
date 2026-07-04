import { NativeModules, Platform } from 'react-native';

/**
 * Firebase Analytics is a native module: it only exists in a Dev/EAS build,
 * never in Expo Go or on web. Its JS wrapper throws as soon as it's imported
 * (not just when called) if the native module isn't linked, so we only
 * `require` it once we've confirmed the native side actually exists — a plain
 * top-level `import` would crash Expo Go before any try/catch could run.
 * Every call is still wrapped so analytics stays strictly best-effort and
 * invisible to the user.
 */
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
const isFirebaseLinked = isNative && NativeModules.RNFBAppModule != null;

let analytics: typeof import('@react-native-firebase/analytics').default | null = null;
if (isFirebaseLinked) {
  try {
    analytics = require('@react-native-firebase/analytics').default;
  } catch {
    analytics = null;
  }
}

function track(run: (getAnalytics: NonNullable<typeof analytics>) => Promise<unknown>): void {
  if (!analytics) return;
  try {
    void run(analytics).catch(() => {
      /* swallow network / SDK errors */
    });
  } catch {
    // Defensive: shouldn't happen since analytics is only set once linked.
  }
}

export type AuthMethod = 'email' | 'google' | 'apple';
export type ExpenseEntryMethod = 'manual' | 'receipt' | 'voice';

/**
 * Single entry point for product analytics. Keep every event name and its
 * params here so the full list of tracked user actions lives in one file.
 */
export const Analytics = {
  /** Ties later events to a user across sessions. Pass null on sign-out. */
  setUser(userId: string | null) {
    track((getAnalytics) => getAnalytics().setUserId(userId));
  },

  logSignUp(method: AuthMethod) {
    track((getAnalytics) => getAnalytics().logSignUp({ method }));
  },

  logLogin(method: AuthMethod) {
    track((getAnalytics) => getAnalytics().logLogin({ method }));
  },

  /** Core activation event. `method` = how the expense was entered. */
  logExpenseAdded(method: ExpenseEntryMethod) {
    track((getAnalytics) =>
      getAnalytics().logEvent('expense_added', { entry_method: method }),
    );
  },

  logReceiptScan(success: boolean) {
    track((getAnalytics) =>
      getAnalytics().logEvent(success ? 'receipt_scan_success' : 'receipt_scan_failed'),
    );
  },

  logVoiceEntry(success: boolean) {
    track((getAnalytics) =>
      getAnalytics().logEvent(success ? 'voice_entry_success' : 'voice_entry_failed'),
    );
  },

  /** `source` = what opened the paywall (feature-gate title / screen). */
  logViewPaywall(source?: string) {
    track((getAnalytics) =>
      getAnalytics().logEvent('view_paywall', source ? { source } : undefined),
    );
  },

  logBeginCheckout(plan: string) {
    track((getAnalytics) => getAnalytics().logEvent('begin_checkout', { plan }));
  },
};
