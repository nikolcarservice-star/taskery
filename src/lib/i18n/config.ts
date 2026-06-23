import type { AppLocale } from "@/lib/i18n/types";

export const APP_LOCALES = ["ru", "uk", "pl", "en"] as const satisfies readonly AppLocale[];

export const defaultLocale: AppLocale = "ru";

export const LOCALE_COOKIE = "taskery_locale";

export const localeConfig: Record<
  AppLocale,
  {
    label: string;
    nativeLabel: string;
    flag: string;
    htmlLang: string;
    openGraphLocale: string;
    hreflang: string;
    contentLanguage: string;
    intlLocale: string;
  }
> = {
  ru: {
    label: "Русский",
    nativeLabel: "Русский",
    flag: "🇷🇺",
    htmlLang: "ru",
    openGraphLocale: "ru_RU",
    hreflang: "ru",
    contentLanguage: "ru",
    intlLocale: "ru-RU",
  },
  uk: {
    label: "Украинский",
    nativeLabel: "Українська",
    flag: "🇺🇦",
    htmlLang: "uk",
    openGraphLocale: "uk_UA",
    hreflang: "uk",
    contentLanguage: "uk",
    intlLocale: "uk-UA",
  },
  pl: {
    label: "Польский",
    nativeLabel: "Polski",
    flag: "🇵🇱",
    htmlLang: "pl",
    openGraphLocale: "pl_PL",
    hreflang: "pl",
    contentLanguage: "pl",
    intlLocale: "pl-PL",
  },
  en: {
    label: "Английский",
    nativeLabel: "English",
    flag: "🇬🇧",
    htmlLang: "en",
    openGraphLocale: "en_GB",
    hreflang: "en",
    contentLanguage: "en",
    intlLocale: "en-GB",
  },
};

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function getLocaleConfig(locale: AppLocale) {
  return localeConfig[locale];
}
