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

/** Parse Prisma Decimal, string, or number without float/formatting surprises. */
export function parseMoneyAmount(
  amount: number | { toString(): string } | null | undefined,
): number | null {
  if (amount === null || amount === undefined) {
    return null;
  }

  if (typeof amount === "number") {
    return Number.isFinite(amount) ? amount : null;
  }

  if (typeof amount === "string") {
    const trimmed = amount.trim().replace(/\s/g, "");
    if (!trimmed) {
      return null;
    }
    const normalized =
      trimmed.includes(",") && !trimmed.includes(".")
        ? trimmed.replace(",", ".")
        : trimmed;
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : null;
  }

  const text = amount.toString().trim();
  if (!text || text === "[object Object]") {
    return null;
  }

  const numeric = Number(text.replace(/\s/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export function normalizeMoneyAmount(
  amount: number,
  currency: string,
): number {
  if (!Number.isFinite(amount)) {
    return amount;
  }

  if (currency === "EUR") {
    return Math.round(amount * 100) / 100;
  }

  if (currency === "UAH" || currency === "PLN") {
    return Math.round(amount);
  }

  return amount;
}

export function formatMoney(
  amount: number | { toString(): string } | null | undefined,
  currency: string,
  locale?: AppLocale,
): string {
  const raw = parseMoneyAmount(amount);
  if (raw === null) {
    return "";
  }

  const supported = isSupportedCurrency(currency) ? currency : defaultCurrency;
  const intlLocale = resolveIntlLocale(supported, locale);
  const config = currencyConfig[supported];
  const isIntegerCurrency = supported === "UAH" || supported === "PLN";
  const fractionDigits = isIntegerCurrency ? 0 : 2;
  const numeric = normalizeMoneyAmount(raw, supported);

  try {
    const formatted = new Intl.NumberFormat(intlLocale, {
      style: "decimal",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      useGrouping: true,
    }).format(numeric);
    return `${formatted}\u00a0${config.symbol}`;
  } catch {
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
