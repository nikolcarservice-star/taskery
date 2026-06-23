import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

export { absoluteUrl, siteUrl } from "@/lib/site-url";

export { APP_LOCALES, defaultLocale, getLocaleConfig, isAppLocale, localeConfig, LOCALE_COOKIE } from "@/lib/i18n/config";
export {
  currencyConfig,
  defaultCurrency,
  formatBudget,
  formatMoney,
  getCurrencyOptions,
  isSupportedCurrency,
  SUPPORTED_CURRENCIES,
} from "@/lib/i18n/currencies";
export { getDictionary, getFaqItems } from "@/lib/i18n/dictionary";
export { getHomeSeo, buildLocaleAlternates } from "@/lib/i18n/seo";
export { getLocaleFromPathname, localizedPath } from "@/lib/i18n/paths";
export const siteConfig = {
  name: "Taskery",
  title: "Taskery — freelance marketplace",
  description:
    "Freelance marketplace for clients and freelancers in Ukraine, Poland and Europe. Escrow deals, ratings and secure payments in UAH, PLN and EUR.",
  url: siteUrl,
  locale: "ru_RU",
  keywords: [
    "freelance",
    "freelance marketplace",
    "remote work",
    "escrow",
    "Taskery",
  ],
  twitter: "@taskery",
  emails: {
    support: "support@taskery.com",
    noreply: "noreply@taskery.com",
  },
};

export async function getDefaultHomeSeo() {
  const dict = await getDictionary(defaultLocale);
  return dict.meta.home;
}
