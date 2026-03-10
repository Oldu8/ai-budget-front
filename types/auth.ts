/**
 * Auth-related types aligned with backend API (app_users, app_user_settings, subscriptions, etc.).
 */

export interface AppUser {
  id: number;
  supabase_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  email_verified_at: string | null;
}

export interface AppUserSettings {
  currency: string;
  language: string;
  timezone: string;
}

/** Plan type enum for validation and comparisons (e.g. feature gates, CSV export). */
export enum PlanType {
  Free = 'free',
  Basic = 'basic',
  Plus = 'plus',
  Premium = 'premium',
}

/** All plan type values for validation (e.g. zod.enum(PlanTypeValues)). */
export const PlanTypeValues = Object.values(PlanType) as [PlanType, ...PlanType[]];

export interface Plan {
  /** Backend returns this as string; use PlanType enum for validation and comparisons. */
  type: PlanType | string;
  price: number;
  check_limit: number;
  label: string;
  description: string;
}

export interface UserSubscription {
  id: number;
  status_id: string;
  used_checks_count: number;
  current_period_end: string;
  plan: Plan;
}

export interface ScanUsage {
  scans_remaining: number;
  scans_limit: number;
  period_end: string | null;
}

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
