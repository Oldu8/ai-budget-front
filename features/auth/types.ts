import type { AppUser, AppUserSettings, UserSubscription, ScanUsage } from '@/entities/user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Raw user from register/login — backend may omit first_name, last_name. */
export interface AuthResponseUser {
  id: number;
  email: string;
  email_verified_at?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Maps backend user to AppUser (fills missing fields). */
export function mapAuthUserToAppUser(u: AuthResponseUser): AppUser {
  return {
    id: u.id,
    email: u.email,
    first_name: u.first_name ?? null,
    last_name: u.last_name ?? null,
    email_verified_at: u.email_verified_at ?? null,
  };
}

/** POST /api/auth/register response (201) */
export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  user: AuthResponseUser;
}

/** POST /api/auth/login response (200) */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthResponseUser;
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
  /** Status name for the current subscription row when present (`active`, `trialing`, …); null if none. */
  subscription_status: string | null;
  scan_usage: ScanUsage;
  settings?: AppUserSettings;
}
