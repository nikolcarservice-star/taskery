import { SubscriptionPlan } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const TASKBOOST_REGISTRATION_DAYS = 20;
export const TASKBOOST_PORTFOLIO_BONUS_DAYS = 10;

/** Paid TaskBoost checkout — disabled until subscription billing launches. */
export const taskBoostPurchaseEnabled = false;

export function addBoostDays(from: Date, days: number): Date {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  return result;
}

export function getRegistrationBoostFields(): {
  subscriptionPlan: SubscriptionPlan;
  featuredUntil: Date;
} {
  return {
    subscriptionPlan: SubscriptionPlan.PRO,
    featuredUntil: addBoostDays(new Date(), TASKBOOST_REGISTRATION_DAYS),
  };
}

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
