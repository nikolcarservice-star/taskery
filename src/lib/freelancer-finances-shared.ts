import type { AppLocale } from "@/lib/i18n/types";

export type FinanceTab = "balance" | "withdrawals" | "statistics";

export type FinanceSummary = {
  availableBalance: number;
  escrowBalance: number;
  totalEarned: number;
  activeProjects: number;
  currency: string;
};

export type FinanceLedgerEntry = {
  id: string;
  createdAt: string;
  settledAt: string | null;
  title: string;
  projectSlug: string | null;
  amount: number;
  direction: "credit" | "debit" | "hold" | "pending";
};

export type PendingWithdrawalInfo = {
  id: string;
  amount: number;
  createdAt: string;
  method: string;
  destination: string;
};

export type MonthlyStat = {
  monthKey: string;
  label: string;
  projects: number;
  amount: number;
};

export type SavedPayoutDetails = {
  method: "CARD" | "IBAN";
  destination: string;
  holderName: string | null;
};

export type FreelancerFinanceData = {
  summary: FinanceSummary;
  ledger: FinanceLedgerEntry[];
  withdrawalLedger: FinanceLedgerEntry[];
  pendingWithdrawal: PendingWithdrawalInfo | null;
  savedPayout: SavedPayoutDetails | null;
  monthlyStats: MonthlyStat[];
  yearTotal: number;
};

export function formatUah(amount: number): string {
  return `${amount.toLocaleString("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ₴`;
}

const FINANCE_DATE_LOCALE: Record<AppLocale, string> = {
  ru: "ru-RU",
  uk: "uk-UA",
  pl: "pl-PL",
  en: "en-GB",
};

export function formatFinanceDate(iso: string, locale: AppLocale = "ru") {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString(FINANCE_DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
  });
  const timePart = date.toLocaleTimeString(FINANCE_DATE_LOCALE[locale], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}
