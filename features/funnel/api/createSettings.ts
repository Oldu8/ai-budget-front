import { protectedPost } from '@/shared/api/protectedClient';

export interface CreateSettingsBody {
  currency: string;
  language: string;
  timezone: string;
}

export interface AppUserSettings {
  currency: string;
  language: string;
  timezone: string;
}

export const settingsApi = {
  create(body: CreateSettingsBody) {
    return protectedPost<AppUserSettings>('/api/me/settings', body);
  },
};
