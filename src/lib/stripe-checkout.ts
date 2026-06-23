import {
  currencyConfig,
  formatMoney,
  getTopUpLimits,
  isSupportedCurrency,
  toStripeMinorUnits,
  type SupportedCurrency,
} from "@/lib/i18n/currencies";
import type Stripe from "stripe";

export function resolveStripeCurrency(currency: string): SupportedCurrency | null {
  return isSupportedCurrency(currency) ? currency : null;
}

export function buildStripePriceData(
  amount: number,
  currency: SupportedCurrency,
  productName: string,
  description?: string,
): Stripe.Checkout.SessionCreateParams.LineItem["price_data"] {
  return {
    currency: currencyConfig[currency].stripeCode,
    product_data: {
      name: productName,
      ...(description ? { description } : {}),
    },
    unit_amount: toStripeMinorUnits(amount, currency),
  };
}

export function validateTopUpAmount(
  amount: number,
  currency: SupportedCurrency,
): string | null {
  const { min, max } = getTopUpLimits(currency);

  if (!Number.isFinite(amount) || amount < min || amount > max) {
    return `Сумма должна быть от ${formatMoney(min, currency)} до ${formatMoney(max, currency)}`;
  }

  return null;
}
