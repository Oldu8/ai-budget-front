import { api } from '@/shared/api/client';
import { protectedDelete, protectedPut } from '@/shared/api/protectedClient';
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  SocialResponse,
  SocialProvider,
  ChangePasswordBody,
} from '@/features/auth/types';

/** Public auth endpoints (no token). */
export const authApi = {
  register(payload: { email: string; password: string }) {
    return api.post<RegisterResponse>('/api/auth/register', payload);
  },

  login(payload: { email: string; password: string }) {
    return api.post<LoginResponse>('/api/auth/login', payload);
  },

  /** Exchange a provider id_token for our own tokens. `name` is sent on first Apple sign-in. */
  social(payload: { provider: SocialProvider; id_token: string; name?: string }) {
    return api.post<SocialResponse>('/api/auth/social', payload);
  },

  refresh(payload: { refresh_token: string }) {
    return api.post<RefreshResponse>('/api/auth/refresh', payload);
  },

  /** Revokes the given refresh token server-side. Public endpoint; refresh_token is required. */
  logout(payload: { refresh_token: string }) {
    return api.post<unknown>('/api/auth/logout', payload);
  },

  /** Change password for the logged-in user (protected). */
  changePassword(payload: ChangePasswordBody) {
    return protectedPut<{ message: string }>('/api/me/password', payload);
  },

  /** Soft-delete the logged-in account. Sessions are revoked server-side. */
  deleteAccount() {
    return protectedDelete('/api/me');
  },
};
