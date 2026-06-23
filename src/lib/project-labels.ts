import { BidStatus, ProjectStatus } from "@/generated/prisma/client";
import { formatBudget as formatBudgetMoney } from "@/lib/i18n/currencies";
import type { AppLocale } from "@/lib/i18n/types";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  OPEN: "Открыт",
  IN_PROGRESS: "В работе",
  CLOSED: "Закрыт",
  UNDER_DISPUTE: "Спор",
};

export const projectStatusColors: Record<ProjectStatus, string> = {
  OPEN: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  CLOSED: "bg-zinc-100 text-zinc-700",
  UNDER_DISPUTE: "bg-red-100 text-red-800",
};

export function formatBudget(
  budget: { toString(): string } | null,
  currency: string,
  locale?: AppLocale,
): string {
  return formatBudgetMoney(budget, currency, locale);
}

export const bidStatusLabels: Record<BidStatus, string> = {
  PENDING: "На рассмотрении",
  ACCEPTED: "Принят",
  REJECTED: "Отклонён",
};

export const bidStatusColors: Record<BidStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-zinc-100 text-zinc-600",
};

export {
  SUPPORTED_CURRENCIES,
  currencyConfig,
  formatMoney,
  getCurrencyOptions,
  isSupportedCurrency,
} from "@/lib/i18n/currencies";
