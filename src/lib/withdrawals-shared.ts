import type { AppLocale } from "@/lib/i18n/types";
import type { ActionErrorCode } from "@/lib/action-errors";

export const MIN_WITHDRAWAL_UAH = 500;

export type WithdrawalPayoutMethod = "CARD" | "IBAN";

export type WithdrawalMetadata = {
  method: WithdrawalPayoutMethod;
  destination: string;
  rejectReason?: string;
  approvedById?: string;
  rejectedById?: string;
  reviewedAt?: string;
};

const METHOD_LABELS: Record<AppLocale, Record<WithdrawalPayoutMethod, string>> = {
  ru: { CARD: "Карта", IBAN: "IBAN" },
  uk: { CARD: "Картка", IBAN: "IBAN" },
  pl: { CARD: "Karta", IBAN: "IBAN" },
  en: { CARD: "Card", IBAN: "IBAN" },
};

export function parseWithdrawalMetadata(
  metadata: unknown,
): WithdrawalMetadata | null {
  if (!metadata || typeof metadata !== "object") return null;
  const data = metadata as Record<string, unknown>;
  const method = data.method;
  const destination = data.destination;
  if (method !== "CARD" && method !== "IBAN") return null;
  if (typeof destination !== "string" || !destination.trim()) return null;
  return {
    method,
    destination: destination.trim(),
    rejectReason:
      typeof data.rejectReason === "string" ? data.rejectReason : undefined,
    approvedById:
      typeof data.approvedById === "string" ? data.approvedById : undefined,
    rejectedById:
      typeof data.rejectedById === "string" ? data.rejectedById : undefined,
    reviewedAt:
      typeof data.reviewedAt === "string" ? data.reviewedAt : undefined,
  };
}

export function withdrawalMethodLabel(
  method: WithdrawalPayoutMethod,
  locale: AppLocale = "en",
): string {
  return METHOD_LABELS[locale][method];
}

export function maskPayoutDestination(destination: string): string {
  if (destination.length <= 8) return destination;
  return `${destination.slice(0, 4)}…${destination.slice(-4)}`;
}

export function validatePayoutDetails(
  method: string | null,
  destination: string | null,
):
  | { method: WithdrawalPayoutMethod; destination: string }
  | { error: ActionErrorCode } {
  if (method !== "CARD" && method !== "IBAN") {
    return { error: "WITHDRAWAL_PAYOUT_METHOD_REQUIRED" };
  }

  const trimmed = destination?.trim();
  if (!trimmed || trimmed.length < 4) {
    return { error: "WITHDRAWAL_PAYOUT_DESTINATION_REQUIRED" };
  }

  const normalized =
    method === "CARD"
      ? trimmed.replace(/\s/g, "")
      : trimmed.replace(/\s/g, "").toUpperCase();

  if (method === "CARD" && !/^\d{12,19}$/.test(normalized)) {
    return { error: "WITHDRAWAL_CARD_INVALID" };
  }

  if (method === "IBAN" && normalized.length < 15) {
    return { error: "WITHDRAWAL_IBAN_INVALID" };
  }

  return { method, destination: normalized };
}
