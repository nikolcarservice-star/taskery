"use server";

import { actionError, ActionErrorCode } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { verifyUserTotp } from "@/lib/actions/two-factor";
import { notifyAdminsWithPermission } from "@/lib/admin-notify";
import { prisma } from "@/lib/prisma";
import {
  atomicRequestWithdrawal,
  WithdrawalError,
} from "@/lib/withdrawal-ops";
import {
  MIN_WITHDRAWAL_UAH,
  validatePayoutDetails,
} from "@/lib/withdrawals-shared";
import { revalidatePath } from "next/cache";

export type WithdrawalRequestState = {
  error?: string;
  success?: boolean;
};

export async function requestWithdrawal(
  _prevState: WithdrawalRequestState,
  formData: FormData,
): Promise<WithdrawalRequestState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return actionError("WITHDRAWAL_FREELANCERS_ONLY");
  }

  const amountRaw = (formData.get("amount") as string | null)?.trim();
  const method = (formData.get("method") as string | null)?.trim() ?? null;
  const destination =
    (formData.get("destination") as string | null)?.trim() ?? null;

  const amount = Number(amountRaw?.replace(",", "."));
  if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL_UAH) {
    return actionError("WITHDRAWAL_MIN_AMOUNT");
  }

  const validated = validatePayoutDetails(method, destination);
  if ("error" in validated) return { error: validated.error };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  });

  const totpCode = (formData.get("totpCode") as string | null)?.trim() ?? "";

  if (user?.twoFactorEnabled) {
    if (!totpCode) {
      return actionError(ActionErrorCode.TWO_FACTOR_REQUIRED);
    }
    const valid = await verifyUserTotp(session.user.id, totpCode);
    if (!valid) {
      return actionError(ActionErrorCode.TWO_FACTOR_INVALID);
    }
  }

  try {
    const payment = await atomicRequestWithdrawal(session.user.id, amount, {
      method: validated.method,
      destination: validated.destination,
    });

    await notifyAdminsWithPermission("FINANCE", {
      type: "ADMIN_WITHDRAWAL",
      template: "ADMIN_WITHDRAWAL_REQUEST",
      variables: { amount: `${amount.toLocaleString("uk-UA")} ₴` },
      link: "/admin",
      metadata: { paymentId: payment.id, userId: session.user.id, amount },
    });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      const code =
        error.code === "PENDING_EXISTS"
          ? "WITHDRAWAL_PENDING_EXISTS"
          : error.code === "INSUFFICIENT"
            ? "WITHDRAWAL_INSUFFICIENT_BALANCE"
            : error.code === "NOT_FOUND"
              ? "WITHDRAWAL_NOT_FOUND"
              : "INVALID_REQUEST";
      return actionError(code);
    }
    throw error;
  }

  revalidatePath("/dashboard/finances");
  return { success: true };
}

export async function getFreelancerPendingWithdrawal(userId: string) {
  const payment = await prisma.payment.findFirst({
    where: { userId, type: "WITHDRAWAL", status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      metadata: true,
    },
  });

  if (!payment) return null;

  return {
    id: payment.id,
    amount: Number(payment.amount),
    createdAt: payment.createdAt.toISOString(),
    metadata: payment.metadata,
  };
}
