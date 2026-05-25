import { protectedPost } from '@/shared/api/protectedClient';
import type { AppUserSettings } from '@/entities/user';

export interface CreateSettingsBody {
  currency: string;
  language: string;
  timezone: string;
}

export const settingsApi = {
  create(body: CreateSettingsBody) {
    return protectedPost<AppUserSettings>('/api/me/settings', body);
  },
};
