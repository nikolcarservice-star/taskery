import { localeConfig } from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";
import type { Dictionary } from "@/lib/i18n/types";

export type FinanceLedgerLabels = Dictionary["cabinetForms"]["finances"]["ledger"];

export function formatFinanceMonthLabel(date: Date, locale: AppLocale): string {
  const intlLocale = localeConfig[locale].intlLocale;
  const month = new Intl.DateTimeFormat(intlLocale, { month: "long" }).format(date);
  const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capitalized} ${date.getFullYear()}`;
}

export function formatLedgerProjectTitle(
  template: string,
  projectTitle: string,
): string {
  return template.replace("{project}", projectTitle);
}
