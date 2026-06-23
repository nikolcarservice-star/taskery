import {
  formatFinanceMonthLabel,
  formatLedgerProjectTitle,
  type FinanceLedgerLabels,
} from "@/lib/finance-labels";
import type { AppLocale } from "@/lib/i18n/types";
import {
  type FinanceLedgerEntry,
  type FreelancerFinanceData,
  type MonthlyStat,
  type PendingWithdrawalInfo,
} from "@/lib/freelancer-finances-shared";
import { prisma } from "@/lib/prisma";
import {
  parseWithdrawalMetadata,
  withdrawalMethodLabel,
} from "@/lib/withdrawals-shared";

function buildMonthlyStats(
  contracts: Array<{
    status: string;
    freelancerPayout: { toString(): string };
    updatedAt: Date;
  }>,
  locale: AppLocale,
): { monthlyStats: MonthlyStat[]; yearTotal: number } {
  const now = new Date();
  const monthlyStats: MonthlyStat[] = [];

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const monthContracts = contracts.filter((contract) => {
      if (contract.status !== "RELEASED") return false;
      const updated = contract.updatedAt;
      return (
        updated.getFullYear() === date.getFullYear() &&
        updated.getMonth() === date.getMonth()
      );
    });

    monthlyStats.push({
      monthKey,
      label: formatFinanceMonthLabel(date, locale),
      projects: monthContracts.length,
      amount: monthContracts.reduce(
        (sum, contract) => sum + Number(contract.freelancerPayout),
        0,
      ),
    });
  }

  const currentYear = now.getFullYear();
  const yearTotal = contracts
    .filter(
      (contract) =>
        contract.status === "RELEASED" &&
        contract.updatedAt.getFullYear() === currentYear,
    )
    .reduce((sum, contract) => sum + Number(contract.freelancerPayout), 0);

  return { monthlyStats, yearTotal };
}

export async function getFreelancerFinanceData(
  userId: string,
  locale: AppLocale,
  ledgerLabels: FinanceLedgerLabels,
): Promise<FreelancerFinanceData> {
  const [user, contracts, withdrawalPayments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    }),
    prisma.contract.findMany({
      where: { freelancerId: userId },
      include: {
        project: { select: { title: true, slug: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.payment.findMany({
      where: { userId, type: "WITHDRAWAL" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        metadata: true,
      },
    }),
  ]);

  const availableBalance = Number(user?.balance ?? 0);
  const escrowBalance = contracts
    .filter((contract) => contract.status === "ESCROWED")
    .reduce((sum, contract) => sum + Number(contract.freelancerPayout), 0);
  const totalEarned = contracts
    .filter((contract) => contract.status === "RELEASED")
    .reduce((sum, contract) => sum + Number(contract.freelancerPayout), 0);
  const activeProjects = contracts.filter(
    (contract) => contract.status === "ESCROWED",
  ).length;

  const ledger: FinanceLedgerEntry[] = [];

  for (const contract of contracts) {
    if (contract.status === "RELEASED") {
      ledger.push({
        id: contract.id,
        createdAt: contract.updatedAt.toISOString(),
        settledAt: contract.updatedAt.toISOString(),
        title: formatLedgerProjectTitle(
          ledgerLabels.projectPayment,
          contract.project.title,
        ),
        projectSlug: contract.project.slug,
        amount: Number(contract.freelancerPayout),
        direction: "credit",
      });
    } else if (contract.status === "ESCROWED") {
      ledger.push({
        id: `escrow-${contract.id}`,
        createdAt: contract.createdAt.toISOString(),
        settledAt: null,
        title: formatLedgerProjectTitle(
          ledgerLabels.projectEscrow,
          contract.project.title,
        ),
        projectSlug: contract.project.slug,
        amount: Number(contract.freelancerPayout),
        direction: "hold",
      });
    }
  }

  ledger.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const withdrawalLedger: FinanceLedgerEntry[] = [];
  let pendingWithdrawal: PendingWithdrawalInfo | null = null;

  for (const payment of withdrawalPayments) {
    const meta = parseWithdrawalMetadata(payment.metadata);
    const amount = Number(payment.amount);
    const createdAt = payment.createdAt.toISOString();

    if (payment.status === "PENDING" && meta) {
      pendingWithdrawal = {
        id: payment.id,
        amount,
        createdAt,
        method: withdrawalMethodLabel(meta.method),
        destination: meta.destination,
      };
      withdrawalLedger.push({
        id: payment.id,
        createdAt,
        settledAt: null,
        title: ledgerLabels.withdrawalPending,
        projectSlug: null,
        amount,
        direction: "pending",
      });
    } else if (payment.status === "COMPLETED") {
      withdrawalLedger.push({
        id: payment.id,
        createdAt,
        settledAt: createdAt,
        title: ledgerLabels.withdrawalCompleted,
        projectSlug: null,
        amount,
        direction: "debit",
      });
    } else if (payment.status === "FAILED") {
      withdrawalLedger.push({
        id: payment.id,
        createdAt,
        settledAt: createdAt,
        title: meta?.rejectReason
          ? `${ledgerLabels.withdrawalRejected}: ${meta.rejectReason}`
          : ledgerLabels.withdrawalRejected,
        projectSlug: null,
        amount,
        direction: "credit",
      });
    }
  }

  const { monthlyStats, yearTotal } = buildMonthlyStats(contracts, locale);

  return {
    summary: {
      availableBalance,
      escrowBalance,
      totalEarned,
      activeProjects,
      currency: "UAH",
    },
    ledger,
    withdrawalLedger,
    pendingWithdrawal,
    monthlyStats,
    yearTotal,
  };
}
