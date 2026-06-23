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

export function withdrawalMethodLabel(method: WithdrawalPayoutMethod): string {
  return method === "CARD" ? "Карта" : "IBAN";
}
