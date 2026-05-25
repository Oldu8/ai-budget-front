/**
 * Domain entity types aligned with backend API (app_users, app_user_settings, subscriptions, etc.).
 */

export interface AppUser {
  id: number;
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
  /** Stripe-aligned status name from API (`active`, `trialing`, …). */
  status: string;
  used_checks_count: number;
  current_period_end: string;
  plan: Plan;
}

export interface ScanUsage {
  scans_remaining: number;
  scans_limit: number;
  period_end: string | null;
}
