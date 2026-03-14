import { z } from 'zod';

function createNameSchema(requiredMsg: string) {
  return z
    .string()
    .transform((s) => s.trim().replace(/\s+/g, ' '))
    .refine((s) => s.length > 0, requiredMsg)
    .pipe(
      z
        .string()
        .min(2, 'Enter at least 2 characters')
        .max(50, 'Maximum 50 characters')
    )
    .refine(
      (s) => /^[\p{L}\s\-']+$/u.test(s),
      'Only letters, spaces, hyphens, and apostrophes are allowed'
    );
}

export const settingsSchema = z.object({
  first_name: createNameSchema('First name is required'),
  last_name: createNameSchema('Last name is required'),
  currency: z.string().min(1, 'Currency is required'),
  language: z.string().min(1, 'Language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
