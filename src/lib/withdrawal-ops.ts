import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { WithdrawalPayoutMethod } from "@/lib/withdrawals-shared";

export class WithdrawalError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export async function atomicRequestWithdrawal(
  userId: string,
  amount: number,
  payout: { method: WithdrawalPayoutMethod; destination: string },
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.payment.findFirst({
      where: { userId, type: "WITHDRAWAL", status: "PENDING" },
      select: { id: true },
    });

    if (existing) {
      throw new WithdrawalError(
        "У вас уже есть заявка на вывод в обработке",
        "PENDING_EXISTS",
      );
    }

    const updated = await tx.user.updateMany({
      where: { id: userId, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });

    if (updated.count === 0) {
      throw new WithdrawalError("Недостаточно средств на балансе", "INSUFFICIENT");
    }

    const metadata: Prisma.InputJsonValue = {
      method: payout.method,
      destination: payout.destination,
    };

    return tx.payment.create({
      data: {
        userId,
        amount,
        type: "WITHDRAWAL",
        status: "PENDING",
        metadata,
      },
    });
  });
}

export async function atomicApproveWithdrawal(
  paymentId: string,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        amount: true,
        metadata: true,
      },
    });

    if (!payment || payment.type !== "WITHDRAWAL" || payment.status !== "PENDING") {
      throw new WithdrawalError(
        "Заявка не найдена или уже обработана",
        "NOT_FOUND",
      );
    }

    const metadata = {
      ...(typeof payment.metadata === "object" && payment.metadata
        ? (payment.metadata as Record<string, unknown>)
        : {}),
      approvedById: adminId,
      reviewedAt: new Date().toISOString(),
    };

    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        metadata,
      },
    });

    return payment;
  });
}

export async function atomicRejectWithdrawal(
  paymentId: string,
  adminId: string,
  reason: string,
) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        amount: true,
        metadata: true,
      },
    });

    if (!payment || payment.type !== "WITHDRAWAL" || payment.status !== "PENDING") {
      throw new WithdrawalError(
        "Заявка не найдена или уже обработана",
        "NOT_FOUND",
      );
    }

    const amount = Number(payment.amount);

    await tx.user.update({
      where: { id: payment.userId },
      data: { balance: { increment: amount } },
    });

    const metadata = {
      ...(typeof payment.metadata === "object" && payment.metadata
        ? (payment.metadata as Record<string, unknown>)
        : {}),
      rejectReason: reason,
      rejectedById: adminId,
      reviewedAt: new Date().toISOString(),
    };

    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "FAILED",
        metadata,
      },
    });

    return payment;
  });
}
