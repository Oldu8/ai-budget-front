import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';

/**
 * Firebase Analytics is a native module: it only exists in a Dev/EAS build,
 * never in Expo Go or on web. Every call is wrapped so a missing native module
 * or a network hiccup can never crash the app — analytics is strictly
 * best-effort and must stay invisible to the user.
 */
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

function track(run: () => Promise<unknown>): void {
  if (!isNative) return;
  try {
    void run().catch(() => {
      /* swallow network / SDK errors */
    });
  } catch {
    // Native module not linked (e.g. running in Expo Go) — ignore.
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
    track(() => analytics().setUserId(userId));
  },

  logSignUp(method: AuthMethod) {
    track(() => analytics().logSignUp({ method }));
  },

  logLogin(method: AuthMethod) {
    track(() => analytics().logLogin({ method }));
  },

  /** Core activation event. `method` = how the expense was entered. */
  logExpenseAdded(method: ExpenseEntryMethod) {
    track(() => analytics().logEvent('expense_added', { entry_method: method }));
  },

  logReceiptScan(success: boolean) {
    track(() =>
      analytics().logEvent(success ? 'receipt_scan_success' : 'receipt_scan_failed'),
    );
  },

  logVoiceEntry(success: boolean) {
    track(() =>
      analytics().logEvent(success ? 'voice_entry_success' : 'voice_entry_failed'),
    );
  },

  /** `source` = what opened the paywall (feature-gate title / screen). */
  logViewPaywall(source?: string) {
    track(() =>
      analytics().logEvent('view_paywall', source ? { source } : undefined),
    );
  },

  logBeginCheckout(plan: string) {
    track(() => analytics().logEvent('begin_checkout', { plan }));
  },
};
