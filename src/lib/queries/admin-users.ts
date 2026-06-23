import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export type AdminUserItem = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  balance: string;
  rating: number;
  subscriptionPlan: string;
  bannedAt: string | null;
  banReason: string | null;
  deletedAt: string | null;
  createdAt: string;
  _count: {
    projectsAsClient: number;
    contractsAsFreelancer: number;
  };
};

export async function getAdminUsers(limit = 100): Promise<AdminUserItem[]> {
  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      balance: true,
      rating: true,
      subscriptionPlan: true,
      bannedAt: true,
      banReason: true,
      deletedAt: true,
      createdAt: true,
      _count: {
        select: {
          projectsAsClient: true,
          contractsAsFreelancer: true,
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
    deletedAt: user.deletedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  }));
}
