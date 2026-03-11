import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { es } from "./locales/es";
import { uk } from "./locales/uk";

export const supportedLanguages = ["en", "es", "uk"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    es: { translation: es },
    uk: { translation: uk },
  },
  interpolation: {
    escapeValue: false,
  },
});

export function setLanguage(language: SupportedLanguage) {
  void i18n.changeLanguage(language);
}

export default i18n;
