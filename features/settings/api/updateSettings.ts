import { protectedPut } from '@/shared/api/protectedClient';

export interface UpdateSettingsBody {
  currency?: string;
  language?: string;
  timezone?: string;
}

export interface AppUserSettings {
  currency: string;
  language: string;
  timezone: string;
}

export const updateSettingsApi = {
  update(body: UpdateSettingsBody) {
    return protectedPut<AppUserSettings>('/api/me/settings', body);
  },
};
