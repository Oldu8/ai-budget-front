import { protectedPut } from '@/shared/api/protectedClient';
import type { AppUserSettings } from '@/entities/user';

export interface UpdateSettingsBody {
  currency?: string;
  language?: string;
  timezone?: string;
}

export const updateSettingsApi = {
  update(body: UpdateSettingsBody) {
    return protectedPut<AppUserSettings>('/api/me/settings', body);
  },
};
