import type { Plan, UserSubscription } from '@/entities/user';
import { protectedGet } from '@/shared/api/protectedClient';
import type { AuthResponseUser, MeResponse } from '@/features/auth/types';
import { mapAuthUserToAppUser } from '@/features/auth/types';

/** Raw API response; backend may use snake_case. User may be under `user` or at root. */
type RawMeResponse = Record<string, unknown>;

function parsePlan(raw: Record<string, unknown>): Plan | null {
  const label = raw.label;
  if (typeof label !== 'string' || !label.trim()) return null;
  return {
    type: (raw.type as Plan['type']) ?? 'free',
    price: typeof raw.price === 'number' ? raw.price : 0,
    check_limit: typeof raw.check_limit === 'number' ? raw.check_limit : 0,
    label,
    description: typeof raw.description === 'string' ? raw.description : '',
  };
}

function normalizeSubscription(raw: unknown): UserSubscription | null {
  if (raw == null || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const planRaw = o.plan;
  if (!planRaw || typeof planRaw !== 'object') return null;
  const plan = parsePlan(planRaw as Record<string, unknown>);
  if (!plan) return null;
  const id = typeof o.id === 'number' ? o.id : Number(o.id);
  if (!Number.isFinite(id)) return null;
  const statusRaw = o.status;
  const status =
    typeof statusRaw === 'string' && statusRaw.trim() ? statusRaw.trim() : '';
  const used =
    typeof o.used_checks_count === 'number'
      ? o.used_checks_count
      : Number(o.used_checks_count) || 0;
  const current_period_end =
    typeof o.current_period_end === 'string' ? o.current_period_end : '';
  return {
    id,
    status,
    used_checks_count: used,
    current_period_end,
    plan,
  };
}

function extractUser(raw: RawMeResponse): AuthResponseUser {
  // Backend may return { user: {...} } or { id, email, first_name, ... } at root
  const u = (raw.user as Record<string, unknown>) ?? raw;
  return {
    id: (u.id as number) ?? 0,
    email: (u.email as string) ?? '',
    supabase_user_id: u.supabase_user_id as string | undefined,
    first_name: (u.first_name as string | null | undefined) ?? null,
    last_name: (u.last_name as string | null | undefined) ?? null,
    email_verified_at: u.email_verified_at as string | null | undefined,
  };
}

export const meApi = {
  async getMe(): Promise<MeResponse> {
    const raw = await protectedGet<RawMeResponse>('/api/me');
    const u = extractUser(raw);
    const normalizedUser = mapAuthUserToAppUser(u);
    const subscription = normalizeSubscription(raw.subscription);
    const rootStatus = raw.subscription_status;
    const rowStatus = subscription?.status?.trim();
    const subscription_status =
      typeof rootStatus === 'string' && rootStatus.trim()
        ? rootStatus.trim()
        : rowStatus
          ? rowStatus
          : null;

    return {
      user: normalizedUser,
      subscription,
      subscription_status,
      scan_usage: (raw.scan_usage ?? {
        scans_remaining: 0,
        scans_limit: 0,
        period_end: null,
      }) as MeResponse['scan_usage'],
      settings: raw.settings as MeResponse['settings'],
    };
  },
};
