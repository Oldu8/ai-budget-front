import type { AppUser, AppUserSettings, UserSubscription, ScanUsage } from '@/entities/user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** POST /api/auth/register response (201) */
export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  user: AppUser;
}

/** POST /api/auth/login response (200) */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AppUser;
  settings?: AppUserSettings;
}

/** POST /api/auth/refresh response (200) */
export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

/** GET /api/me response (200) */
export interface MeResponse {
  user: AppUser;
  subscription: UserSubscription | null;
  scan_usage: ScanUsage;
  settings?: AppUserSettings;
}
