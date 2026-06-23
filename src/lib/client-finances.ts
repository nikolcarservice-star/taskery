import {
  formatFinanceMonthLabel,
  formatLedgerProjectTitle,
  type FinanceLedgerLabels,
} from "@/lib/finance-labels";
import type { AppLocale } from "@/lib/i18n/types";
import {
  type FinanceLedgerEntry,
  type FinanceSummary,
  type MonthlyStat,
} from "@/lib/freelancer-finances-shared";
import { prisma } from "@/lib/prisma";

export type ClientFinanceData = {
  summary: FinanceSummary;
  ledger: FinanceLedgerEntry[];
  monthlyStats: MonthlyStat[];
  yearTotal: number;
};

export async function getClientFinanceData(
  userId: string,
  locale: AppLocale,
  ledgerLabels: FinanceLedgerLabels,
): Promise<ClientFinanceData> {
  const [user, contracts, topups] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    }),
    prisma.contract.findMany({
      where: { clientId: userId },
      include: {
        project: { select: { title: true, slug: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.payment.findMany({
      where: {
        userId,
        type: "BALANCE_TOPUP",
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const availableBalance = Number(user?.balance ?? 0);
  const escrowBalance = contracts
    .filter((contract) => contract.status === "ESCROWED")
    .reduce((sum, contract) => sum + Number(contract.amount), 0);
  const totalSpent = contracts
    .filter((contract) => contract.status === "RELEASED")
    .reduce((sum, contract) => sum + Number(contract.amount), 0);
  const activeProjects = contracts.filter(
    (contract) => contract.status === "ESCROWED",
  ).length;

  const ledger: FinanceLedgerEntry[] = [];

  for (const payment of topups) {
    ledger.push({
      id: payment.id,
      createdAt: payment.createdAt.toISOString(),
      settledAt: payment.createdAt.toISOString(),
      title: ledgerLabels.balanceTopUp,
      projectSlug: null,
      amount: Number(payment.amount),
      direction: "credit",
    });
  }

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
        amount: Number(contract.amount),
        direction: "debit",
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
        amount: Number(contract.amount),
        direction: "hold",
      });
    }
  }

  ledger.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const now = new Date();
  const monthlyStats: MonthlyStat[] = [];

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const monthContracts = contracts.filter((contract) => {
      if (contract.status !== "RELEASED") return false;
      const updated = contract.updatedAt;
      return (
        updated.getFullYear() === date.getFullYear() &&
        updated.getMonth() === date.getMonth()
      );
    });

    monthlyStats.push({
      monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: formatFinanceMonthLabel(date, locale),
      projects: monthContracts.length,
      amount: monthContracts.reduce(
        (sum, contract) => sum + Number(contract.amount),
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
    .reduce((sum, contract) => sum + Number(contract.amount), 0);

  return {
    summary: {
      availableBalance,
      escrowBalance,
      totalEarned: totalSpent,
      activeProjects,
      currency: "UAH",
    },
    ledger,
    monthlyStats,
    yearTotal,
  };
}
