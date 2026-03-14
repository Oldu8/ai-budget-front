import { protectedPut } from '@/shared/api/protectedClient';

export interface UpdateMeBody {
  first_name?: string | null;
  last_name?: string | null;
}

export const meUpdateApi = {
  updateMe(body: UpdateMeBody) {
    return protectedPut<unknown>('/api/me', body);
  },
};
