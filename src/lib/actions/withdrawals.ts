"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  atomicRequestWithdrawal,
  WithdrawalError,
} from "@/lib/withdrawal-ops";
import {
  MIN_WITHDRAWAL_UAH,
  type WithdrawalPayoutMethod,
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
  const method = (formData.get("method") as string | null)?.trim();
  const destination = (formData.get("destination") as string | null)?.trim();

  const amount = Number(amountRaw?.replace(",", "."));
  if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL_UAH) {
    return { error: `Минимальная сумма вывода — ${MIN_WITHDRAWAL_UAH} ₴` };
  }

  if (method !== "CARD" && method !== "IBAN") {
    return { error: "Выберите способ вывода" };
  }

  if (!destination || destination.length < 4) {
    return { error: "Укажите реквизиты для выплаты" };
  }

  if (method === "CARD" && !/^\d{12,19}$/.test(destination.replace(/\s/g, ""))) {
    return { error: "Номер карты должен содержать 12–19 цифр" };
  }

  if (method === "IBAN" && destination.replace(/\s/g, "").length < 15) {
    return { error: "Укажите корректный IBAN" };
  }

  const normalizedDestination =
    method === "CARD"
      ? destination.replace(/\s/g, "")
      : destination.replace(/\s/g, "").toUpperCase();

  try {
    await atomicRequestWithdrawal(session.user.id, amount, {
      method: method as WithdrawalPayoutMethod,
      destination: normalizedDestination,
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
