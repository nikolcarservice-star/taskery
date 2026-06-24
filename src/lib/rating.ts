import { prisma } from "@/lib/prisma";

export async function recalculateUserRating(userId: string): Promise<void> {
  const reviews = await prisma.review.findMany({
    where: { toUserId: userId },
    select: {
      rating: true,
      contract: { select: { _count: { select: { reviews: true } } } },
    },
  });

  const mutualRatings = reviews
    .filter((review) => review.contract._count.reviews >= 2)
    .map((review) => review.rating);

  const rating =
    mutualRatings.length > 0
      ? mutualRatings.reduce((sum, value) => sum + value, 0) / mutualRatings.length
      : 0;

  await prisma.user.update({
    where: { id: userId },
    data: { rating },
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
