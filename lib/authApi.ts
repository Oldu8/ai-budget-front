import { api } from '@/lib/api';
import { protectedPost } from '@/lib/auth/apiClient';
import type { LoginResponse, RegisterResponse, RefreshResponse } from '@/types/auth';

/** Public auth endpoints (no token). */
export const authApi = {
  register(payload: { email: string; password: string }) {
    return api.post<RegisterResponse>('/api/auth/register', payload);
  },

  login(payload: { email: string; password: string }) {
    return api.post<LoginResponse>('/api/auth/login', payload);
  },

  refresh(payload: { refresh_token: string }) {
    return api.post<RefreshResponse>('/api/auth/refresh', payload);
  },

  logout() {
    return protectedPost<unknown>('/api/auth/logout', undefined);
  },
};
