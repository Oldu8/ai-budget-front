import type { Locale } from 'date-fns';
import { format, isValid, parseISO } from 'date-fns';
import { enUS, es, uk as ukLocale } from 'date-fns/locale';

const DATE_LOCALES: Record<string, Locale> = {
  en: enUS,
  es,
  uk: ukLocale,
};

export function formatSubscriptionPeriodEnd(
  iso: string | null | undefined,
  i18nLanguage: string
): string | null {
  if (!iso || typeof iso !== 'string') return null;
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return null;
    const code = i18nLanguage.split(/[-_]/)[0] ?? 'en';
    const locale = DATE_LOCALES[code] ?? enUS;
    return format(d, 'MMM d, yyyy', { locale });
  } catch {
    return null;
  }
}
