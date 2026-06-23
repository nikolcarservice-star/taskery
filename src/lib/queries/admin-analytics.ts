import { prisma } from "@/lib/prisma";

export type DailyMetric = {
  date: string;
  count: number;
};

export type DailyAmountMetric = {
  date: string;
  amount: number;
};

export type AdminAnalyticsOverview = {
  kpis: {
    newUsers30d: number;
    newProjects30d: number;
    releasedGmv30d: number;
    commissions30d: number;
    openDisputes: number;
    pendingReports: number;
    pendingWithdrawals: number;
    pendingWithdrawalsAmount: number;
    activeEscrowCount: number;
    activeEscrowAmount: number;
  };
  dailySignups: DailyMetric[];
  dailyProjects: DailyMetric[];
  dailyGmv: DailyAmountMetric[];
};

function last30DayKeys(): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    keys.push(date.toISOString().slice(0, 10));
  }
  return keys;
}

function bucketByDay<T extends { createdAt: Date }>(
  items: T[],
  keys: string[],
): DailyMetric[] {
  const counts = new Map(keys.map((key) => [key, 0]));
  for (const item of items) {
    const key = item.createdAt.toISOString().slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return keys.map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

function bucketGmvByDay(
  contracts: Array<{ updatedAt: Date; amount: { toString(): string } }>,
  keys: string[],
): DailyAmountMetric[] {
  const amounts = new Map(keys.map((key) => [key, 0]));
  for (const contract of contracts) {
    const key = contract.updatedAt.toISOString().slice(0, 10);
    if (amounts.has(key)) {
      amounts.set(key, (amounts.get(key) ?? 0) + Number(contract.amount));
    }
  }
  return keys.map((date) => ({ date, amount: amounts.get(date) ?? 0 }));
}

export async function getAdminAnalyticsOverview(): Promise<AdminAnalyticsOverview> {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  since.setHours(0, 0, 0, 0);
  const keys = last30DayKeys();

  const [
    recentUsers,
    recentProjects,
    releasedContracts30d,
    openDisputes,
    pendingReports,
    pendingWithdrawals,
    escrowAggregate,
  ] = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gte: since }, role: { not: "ADMIN" } },
      select: { createdAt: true },
    }),
    prisma.project.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.contract.findMany({
      where: { status: "RELEASED", updatedAt: { gte: since } },
      select: { updatedAt: true, amount: true, commission: true },
    }),
    prisma.project.count({ where: { status: "UNDER_DISPUTE" } }),
    prisma.report.count({
      where: { status: { in: ["PENDING", "IN_REVIEW"] } },
    }),
    prisma.payment.findMany({
      where: { type: "WITHDRAWAL", status: "PENDING" },
      select: { amount: true },
    }),
    prisma.contract.aggregate({
      where: { status: { in: ["ESCROWED", "AWAITING_FUNDING"] } },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const releasedGmv30d = releasedContracts30d.reduce(
    (sum, contract) => sum + Number(contract.amount),
    0,
  );
  const commissions30d = releasedContracts30d.reduce(
    (sum, contract) => sum + Number(contract.commission),
    0,
  );
  const pendingWithdrawalsAmount = pendingWithdrawals.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  return {
    kpis: {
      newUsers30d: recentUsers.length,
      newProjects30d: recentProjects.length,
      releasedGmv30d,
      commissions30d,
      openDisputes,
      pendingReports,
      pendingWithdrawals: pendingWithdrawals.length,
      pendingWithdrawalsAmount,
      activeEscrowCount: escrowAggregate._count,
      activeEscrowAmount: Number(escrowAggregate._sum.amount ?? 0),
    },
    dailySignups: bucketByDay(recentUsers, keys),
    dailyProjects: bucketByDay(recentProjects, keys),
    dailyGmv: bucketGmvByDay(releasedContracts30d, keys),
  };
}
