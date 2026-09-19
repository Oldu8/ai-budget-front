import type { Locale } from "date-fns";
import { enUS, es, ru, uk } from "date-fns/locale";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const DATE_FNS_LOCALES: Record<string, Locale> = {
  en: enUS,
  es,
  ru,
  uk,
};

/** date-fns locale for an i18n language code (e.g. "uk", "en-US"). Falls back to enUS. */
export function getDateFnsLocale(language: string): Locale {
  const code = language.split(/[-_]/)[0] ?? "en";
  return DATE_FNS_LOCALES[code] ?? enUS;
}

/** date-fns locale that follows the current i18n language. */
export function useDateFnsLocale(): Locale {
  const { i18n } = useTranslation();
  return useMemo(() => getDateFnsLocale(i18n.language), [i18n.language]);
}
