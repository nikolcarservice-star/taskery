import { prisma } from "@/lib/prisma";
import type { ContractStatus, PaymentStatus, PaymentType } from "@/generated/prisma/client";

export type AdminFinanceOverview = {
  stats: {
    totalUserBalances: number;
    escrowAmount: number;
    escrowCount: number;
    releasedAmount: number;
    totalCommissions: number;
    totalTopups: number;
    completedPaymentsCount: number;
  };
  recentPayments: AdminPaymentItem[];
  activeContracts: AdminContractItem[];
};

export type AdminPaymentItem = {
  id: string;
  amount: string;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: string;
  user: { name: string | null; email: string };
};

export type AdminContractItem = {
  id: string;
  amount: string;
  commission: string;
  freelancerPayout: string;
  status: ContractStatus;
  createdAt: string;
  project: { title: string; slug: string };
  client: { name: string | null; email: string };
  freelancer: { name: string | null; email: string };
};

export async function getAdminFinanceOverview(): Promise<AdminFinanceOverview> {
  const [
    balanceAggregate,
    escrowAggregate,
    releasedAggregate,
    topupsAggregate,
    paymentsCount,
    recentPayments,
    activeContracts,
  ] = await Promise.all([
    prisma.user.aggregate({ _sum: { balance: true } }),
    prisma.contract.aggregate({
      where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.contract.aggregate({
      where: { status: "RELEASED" },
      _sum: { amount: true, commission: true },
    }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED", type: "BALANCE_TOPUP" },
      _sum: { amount: true },
    }),
    prisma.payment.count({ where: { status: "COMPLETED" } }),
    prisma.payment.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        type: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.contract.findMany({
      where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
      select: {
        id: true,
        amount: true,
        commission: true,
        freelancerPayout: true,
        status: true,
        createdAt: true,
        project: { select: { title: true, slug: true } },
        client: { select: { name: true, email: true } },
        freelancer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return {
    stats: {
      totalUserBalances: Number(balanceAggregate._sum.balance ?? 0),
      escrowAmount: Number(escrowAggregate._sum.amount ?? 0),
      escrowCount: escrowAggregate._count,
      releasedAmount: Number(releasedAggregate._sum.amount ?? 0),
      totalCommissions: Number(releasedAggregate._sum.commission ?? 0),
      totalTopups: Number(topupsAggregate._sum.amount ?? 0),
      completedPaymentsCount: paymentsCount,
    },
    recentPayments: recentPayments.map((payment) => ({
      ...payment,
      amount: payment.amount.toString(),
      createdAt: payment.createdAt.toISOString(),
    })),
    activeContracts: activeContracts.map((contract) => ({
      ...contract,
      amount: contract.amount.toString(),
      commission: contract.commission.toString(),
      freelancerPayout: contract.freelancerPayout.toString(),
      createdAt: contract.createdAt.toISOString(),
    })),
  };
}
