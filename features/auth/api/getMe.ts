import { protectedGet } from '@/shared/api/protectedClient';
import type { MeResponse } from '@/features/auth/types';

export const meApi = {
  getMe() {
    return protectedGet<MeResponse>('/api/me');
  },
};
