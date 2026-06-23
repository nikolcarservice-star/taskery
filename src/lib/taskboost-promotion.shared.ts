import "server-only";

import { SubscriptionPlan } from "@/generated/prisma/client";

import {
  TASKBOOST_REGISTRATION_DAYS,
} from "@/lib/taskboost-promotion.constants";

export { TASKBOOST_PORTFOLIO_BONUS_DAYS, TASKBOOST_REGISTRATION_DAYS } from "@/lib/taskboost-promotion.constants";

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
