type BanFields = {
  bannedAt: Date | null;
  bannedUntil: Date | null;
  deletedAt?: Date | null;
};

export function isUserCurrentlyBanned(user: BanFields): boolean {
  if (user.deletedAt) return true;
  if (!user.bannedAt) return false;
  if (user.bannedUntil && user.bannedUntil <= new Date()) return false;
  return true;
}

export function isPermanentBan(user: BanFields): boolean {
  return Boolean(user.bannedAt && !user.bannedUntil);
}

export async function clearExpiredTemporaryBan(userId: string) {
  const { prisma } = await import("@/lib/prisma");
  await prisma.user.updateMany({
    where: {
      id: userId,
      bannedAt: { not: null },
      bannedUntil: { lte: new Date() },
    },
    data: {
      bannedAt: null,
      bannedUntil: null,
      banReason: null,
    },
  });
}
