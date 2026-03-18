import { protectedGet } from '@/shared/api/protectedClient';
import type { AuthResponseUser, MeResponse } from '@/features/auth/types';
import { mapAuthUserToAppUser } from '@/features/auth/types';

/** Raw API response; backend may use snake_case. User may be under `user` or at root. */
type RawMeResponse = Record<string, unknown>;

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
    return {
      user: normalizedUser,
      subscription: (raw.subscription ?? null) as MeResponse['subscription'],
      scan_usage: (raw.scan_usage ?? { scans_remaining: 0, scans_limit: 0, period_end: null }) as MeResponse['scan_usage'],
      settings: raw.settings as MeResponse['settings'],
    };
  },
};
