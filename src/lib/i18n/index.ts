export type { AppLocale, Dictionary, FaqItem } from "@/lib/i18n/types";
export {
  APP_LOCALES,
  defaultLocale,
  getLocaleConfig,
  isAppLocale,
  LOCALE_COOKIE,
  localeConfig,
} from "@/lib/i18n/config";
export {
  currencyConfig,
  defaultCurrency,
  formatBudget,
  formatMoney,
  getCurrencyOptions,
  isSupportedCurrency,
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "@/lib/i18n/currencies";
export { getDictionary, getFaqItems } from "@/lib/i18n/dictionary";
export { getHomeSeo } from "@/lib/i18n/seo";
export {
  buildLocaleAlternates,
  getLocaleFromPathname,
  isLegacyLocalizedPath,
  localizedPath,
  parsePathname,
  stripLocalePrefix,
} from "@/lib/i18n/routing";
export { requireAppLocale } from "@/lib/i18n/locale-page";
