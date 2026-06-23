import type { AppLocale } from "@/lib/i18n/types";
import { getLocaleConfig } from "@/lib/i18n/config";

export const SUPPORTED_CURRENCIES = ["UAH", "PLN", "EUR"] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const currencyConfig: Record<
  SupportedCurrency,
  {
    code: SupportedCurrency;
    symbol: string;
    stripeCode: string;
    intlLocale: string;
    label: Record<AppLocale, string>;
  }
> = {
  UAH: {
    code: "UAH",
    symbol: "₴",
    stripeCode: "uah",
    intlLocale: "uk-UA",
    label: {
      ru: "Гривна (₴)",
      uk: "Гривня (₴)",
      pl: "Hrywna (₴)",
      en: "Hryvnia (₴)",
    },
  },
  PLN: {
    code: "PLN",
    symbol: "zł",
    stripeCode: "pln",
    intlLocale: "pl-PL",
    label: {
      ru: "Злотый (zł)",
      uk: "Злотий (zł)",
      pl: "Złoty (zł)",
      en: "Zloty (zł)",
    },
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    stripeCode: "eur",
    intlLocale: "de-DE",
    label: {
      ru: "Евро (€)",
      uk: "Євро (€)",
      pl: "Euro (€)",
      en: "Euro (€)",
    },
  },
};

export const defaultCurrency: SupportedCurrency = "UAH";

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export function getCurrencyOptions(locale: AppLocale) {
  return SUPPORTED_CURRENCIES.map((code) => ({
    value: code,
    label: currencyConfig[code].label[locale],
  }));
}

/** Smallest currency unit for Stripe (kopecks, grosze, cents). */
export function toStripeMinorUnits(
  amount: number,
  currency: SupportedCurrency,
): number {
  return Math.round(amount * 100);
}

export function getTopUpLimits(_currency: SupportedCurrency) {
  return { min: 100, max: 100_000 };
}

function resolveIntlLocale(currency: SupportedCurrency, locale?: AppLocale): string {
  if (locale) {
    return getLocaleConfig(locale).intlLocale;
  }

  return currencyConfig[currency].intlLocale;
}

export function formatMoney(
  amount: number | { toString(): string } | null | undefined,
  currency: string,
  locale?: AppLocale,
): string {
  if (amount === null || amount === undefined) {
    return "";
  }

  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  const supported = isSupportedCurrency(currency) ? currency : defaultCurrency;
  const intlLocale = resolveIntlLocale(supported, locale);

  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: supported,
      maximumFractionDigits: supported === "UAH" || supported === "PLN" ? 0 : 2,
    }).format(numeric);
  } catch {
    const config = currencyConfig[supported];
    return `${numeric.toLocaleString(intlLocale)} ${config.symbol}`;
  }
}

export function formatBudget(
  budget: { toString(): string } | null,
  currency: string,
  locale?: AppLocale,
  negotiableLabel = "По договорённости",
): string {
  if (budget === null) {
    return negotiableLabel;
  }

  return formatMoney(budget, currency, locale);
}
