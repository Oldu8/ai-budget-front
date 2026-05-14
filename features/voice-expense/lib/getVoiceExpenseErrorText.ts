import { ApiError } from '@/shared/api/client';

export type VoiceExpenseErrorPresentation =
  | {
      kind: 'i18n';
      i18nKey:
        | 'error.quota'
        | 'error.planRequired'
        | 'error.unreadable'
        | 'error.serverError'
        | 'error.permissionDenied'
        | 'error.noAudio'
        | 'error.tooShort'
        | 'error.generic';
      showUpgradeButton?: boolean;
      /** Which paywall copy to show when Upgrade is tapped. */
      upgradePaywall?: 'quota' | 'plan';
    }
  | {
      kind: 'message';
      message: string;
      showUpgradeButton?: boolean;
      upgradePaywall?: 'quota' | 'plan';
    };

function normalizedMessage(err: unknown): string {
  if (err instanceof ApiError && typeof err.message === 'string') {
    return err.message.trim().toLowerCase();
  }
  if (err instanceof Error) {
    return err.message.trim().toLowerCase();
  }
  return '';
}

function classify403(message: string): 'quota' | 'plan' {
  const quotaHints =
    /quota|scan|limit|remaining|allowance|exhausted|too many|running out/.test(
      message
    );
  const planHints =
    /premium|subscription|plan|upgrade|billing|entitled|forbidden/.test(
      message
    );
  if (quotaHints && !planHints) return 'quota';
  if (planHints && !quotaHints) return 'plan';
  if (quotaHints) return 'quota';
  return 'plan';
}

/**
 * Maps API / client errors to user-facing presentation for the voice recording screen.
 */
export function getVoiceExpenseErrorPresentation(
  err: unknown
): VoiceExpenseErrorPresentation {
  if (err instanceof ApiError) {
    if (err.status === 403) {
      const kind = classify403(normalizedMessage(err));
      if (kind === 'quota') {
        return {
          kind: 'i18n',
          i18nKey: 'error.quota',
          showUpgradeButton: true,
          upgradePaywall: 'quota',
        };
      }
      return {
        kind: 'i18n',
        i18nKey: 'error.planRequired',
        showUpgradeButton: true,
        upgradePaywall: 'plan',
      };
    }
    if (err.status === 422) {
      const msg = err.message?.trim();
      if (msg && msg.length > 0 && msg.length < 240) {
        return {
          kind: 'message',
          message: msg,
        };
      }
      return {
        kind: 'i18n',
        i18nKey: 'error.unreadable',
      };
    }
    if (err.status === 503) {
      const msg = err.message?.trim();
      if (msg && msg.length > 0 && msg.length < 240) {
        return {
          kind: 'message',
          message: msg,
        };
      }
      return {
        kind: 'i18n',
        i18nKey: 'error.serverError',
      };
    }
  }

  const msgLower = normalizedMessage(err);
  if (msgLower.includes('permission') || msgLower.includes('microphone')) {
    return {
      kind: 'i18n',
      i18nKey: 'error.permissionDenied',
    };
  }

  return {
    kind: 'i18n',
    i18nKey: 'error.generic',
  };
}
