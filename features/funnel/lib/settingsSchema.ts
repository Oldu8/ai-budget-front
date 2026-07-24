import { z } from 'zod';

export const settingsSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  language: z.string().min(1, 'Language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
