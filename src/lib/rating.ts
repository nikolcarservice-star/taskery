import { prisma } from "@/lib/prisma";

export async function recalculateUserRating(userId: string): Promise<void> {
  const result = await prisma.review.aggregate({
    where: { toUserId: userId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      rating: result._avg.rating ?? 0,
    },
  });
}

export async function getCompletedContractsCount(userId: string): Promise<number> {
  return prisma.contract.count({
    where: {
      freelancerId: userId,
      status: "RELEASED",
    },
  });
}
