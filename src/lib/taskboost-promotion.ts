import "server-only";

import { SubscriptionPlan } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { addBoostDays } from "@/lib/taskboost-promotion.shared";
import { TASKBOOST_PORTFOLIO_BONUS_DAYS } from "@/lib/taskboost-promotion.constants";

export { taskBoostPurchaseEnabled } from "@/lib/taskboost-promotion.constants";

export async function extendTaskBoostDays(
  userId: string,
  days: number,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { featuredUntil: true },
  });
  if (!user) return;

  const now = new Date();
  const base =
    user.featuredUntil && user.featuredUntil > now ? user.featuredUntil : now;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: SubscriptionPlan.PRO,
      featuredUntil: addBoostDays(base, days),
    },
  });
}

export async function grantPortfolioBoostIfEligible(
  userId: string,
  profileId: string,
): Promise<void> {
  const profile = await prisma.freelancerProfile.findUnique({
    where: { id: profileId },
    select: { portfolioBoostGranted: true },
  });

  if (!profile || profile.portfolioBoostGranted) return;

  await prisma.freelancerProfile.update({
    where: { id: profileId },
    data: { portfolioBoostGranted: true },
  });

  await extendTaskBoostDays(userId, TASKBOOST_PORTFOLIO_BONUS_DAYS);
}
