import { Platform } from 'react-native';

import { Crashlytics } from './crashlytics';

/**
 * Native crashes are captured by the Crashlytics SDK automatically — no code
 * needed. This adds the JS-side layer: an uncaught JS error would otherwise
 * only show as a redbox in dev or silently restart the app in prod, with no
 * report. Call once, as early as possible (root layout).
 */
export function setupCrashReporting(): void {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const errorUtils = (global as { ErrorUtils?: ErrorUtilsGlobal }).ErrorUtils;
  if (!isNative || !errorUtils) return;

  const defaultHandler = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error, isFatal) => {
    Crashlytics.recordError(error, isFatal ? 'Unhandled fatal JS error' : 'Unhandled JS error');
    defaultHandler(error, isFatal);
  });
}

interface ErrorUtilsGlobal {
  getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
  setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
}
