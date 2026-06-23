"use server";

import { auth } from "@/lib/auth";
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
    return { error: "Вывод доступен только фрилансерам" };
  }

  const amountRaw = (formData.get("amount") as string | null)?.trim();
  const method = (formData.get("method") as string | null)?.trim() ?? null;
  const destination =
    (formData.get("destination") as string | null)?.trim() ?? null;

  const amount = Number(amountRaw?.replace(",", "."));
  if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL_UAH) {
    return { error: `Минимальная сумма вывода — ${MIN_WITHDRAWAL_UAH} ₴` };
  }

  const validated = validatePayoutDetails(method, destination);
  if ("error" in validated) return { error: validated.error };

  try {
    await atomicRequestWithdrawal(session.user.id, amount, {
      method: validated.method,
      destination: validated.destination,
    });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      return { error: error.message };
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
