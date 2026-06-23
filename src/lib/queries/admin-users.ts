import type { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type AdminUserItem = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  balance: string;
  rating: number;
  subscriptionPlan: string;
  bannedAt: string | null;
  bannedUntil: string | null;
  banReason: string | null;
  deletedAt: string | null;
  createdAt: string;
  _count: {
    projectsAsClient: number;
    contractsAsFreelancer: number;
    warningsReceived: number;
  };
};

export type AdminUsersFilter = {
  q?: string;
  role?: Role;
  status?: "active" | "banned" | "deleted" | "all";
  limit?: number;
};

export async function getAdminUsers(
  filter: AdminUsersFilter = {},
): Promise<AdminUserItem[]> {
  const { q, role, status = "all", limit = 200 } = filter;
  const trimmedQuery = q?.trim();

  const where: {
    role?: Role | { not: Role };
    bannedAt?: null | { not: null };
    deletedAt?: null | { not: null };
    OR?: Array<
      | { email: { contains: string; mode: "insensitive" } }
      | { name: { contains: string; mode: "insensitive" } }
      | { id: string }
    >;
  } = {
    role: role ?? { not: "ADMIN" },
  };

  if (status === "active") {
    where.bannedAt = null;
    where.deletedAt = null;
  } else if (status === "banned") {
    where.bannedAt = { not: null };
    where.deletedAt = null;
  } else if (status === "deleted") {
    where.deletedAt = { not: null };
  }

  if (trimmedQuery) {
    where.OR = [
      { email: { contains: trimmedQuery, mode: "insensitive" } },
      { name: { contains: trimmedQuery, mode: "insensitive" } },
    ];
    if (trimmedQuery.length >= 8) {
      where.OR.push({ id: trimmedQuery });
    }
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      balance: true,
      rating: true,
      subscriptionPlan: true,
      bannedAt: true,
      bannedUntil: true,
      banReason: true,
      deletedAt: true,
      createdAt: true,
      _count: {
        select: {
          projectsAsClient: true,
          contractsAsFreelancer: true,
          warningsReceived: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return users.map((user) => ({
    ...user,
    balance: user.balance.toString(),
    bannedAt: user.bannedAt?.toISOString() ?? null,
    bannedUntil: user.bannedUntil?.toISOString() ?? null,
    deletedAt: user.deletedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  }));
}
