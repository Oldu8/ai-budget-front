import { protectedGet } from '@/lib/auth/apiClient';
import type { MeResponse } from '@/types/auth';

export const meApi = {
  getMe() {
    return protectedGet<MeResponse>('/api/me');
  },
};
