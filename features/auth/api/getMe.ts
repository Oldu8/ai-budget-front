import type {
  AppUser,
  AppUserSettings,
  ScanUsage,
  UserSubscription,
} from '@/entities/user';
import { protectedGet } from '@/shared/api/protectedClient';
import type { MeResponse } from '@/features/auth/types';

/** Flat `/api/me` payload from backend. */
type MeApiResponse = AppUser & {
  settings?: AppUserSettings | null;
  subscription: UserSubscription | null;
  subscription_status: string | null;
  scan_usage: ScanUsage;
};

const DEFAULT_SCAN_USAGE: ScanUsage = {
  scans_remaining: 0,
  scans_limit: 0,
  period_end: null,
};

export const meApi = {
  async getMe(): Promise<MeResponse> {
    const raw = await protectedGet<MeApiResponse>('/api/me');
    const {
      settings,
      subscription,
      subscription_status,
      scan_usage,
      ...user
    } = raw;

    return {
      user,
      subscription,
      subscription_status:
        subscription_status ?? subscription?.status ?? null,
      scan_usage: scan_usage ?? DEFAULT_SCAN_USAGE,
      settings: settings ?? undefined,
    };
  },
};
