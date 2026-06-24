import type { AppLocale } from "@/lib/i18n/types";
import { prisma } from "@/lib/prisma";
import {
  parseWithdrawalMetadata,
  withdrawalMethodLabel,
} from "@/lib/withdrawals-shared";

export type AdminWithdrawalItem = {
  id: string;
  amount: string;
  currency: string;
  createdAt: string;
  method: string;
  destination: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    balance: string;
  };
};

export async function getPendingWithdrawals(
  locale: AppLocale = "en",
): Promise<AdminWithdrawalItem[]> {
  const payments = await prisma.payment.findMany({
    where: { type: "WITHDRAWAL", status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          balance: true,
        },
      },
    },
  });

  return payments
    .map((payment) => {
      const meta = parseWithdrawalMetadata(payment.metadata);
      if (!meta) return null;

      return {
        id: payment.id,
        amount: payment.amount.toString(),
        currency: payment.currency,
        createdAt: payment.createdAt.toISOString(),
        method: withdrawalMethodLabel(meta.method, locale),
        destination: meta.destination,
        user: {
          id: payment.user.id,
          name: payment.user.name,
          email: payment.user.email,
          balance: payment.user.balance.toString(),
        },
      };
    })
    .filter((item): item is AdminWithdrawalItem => item !== null);
}

export async function getPendingWithdrawalCount(): Promise<number> {
  return prisma.payment.count({
    where: { type: "WITHDRAWAL", status: "PENDING" },
  });
}

export async function getPendingWithdrawalTotal(): Promise<number> {
  const aggregate = await prisma.payment.aggregate({
    where: { type: "WITHDRAWAL", status: "PENDING" },
    _sum: { amount: true },
  });
  return Number(aggregate._sum.amount ?? 0);
}
