import "server-only";

import { stripe, stripeConnectEnabled } from "@/lib/stripe-config";
import { prisma } from "@/lib/prisma";

export class StripeConnectError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export async function ensureFreelancerConnectAccount(userId: string): Promise<string> {
  if (!stripeConnectEnabled || !stripe) {
    throw new StripeConnectError("Stripe Connect не настроен", "NOT_CONFIGURED");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      role: true,
      freelancerProfile: {
        select: { id: true, stripeConnectAccountId: true },
      },
    },
  });

  if (!user?.freelancerProfile) {
    throw new StripeConnectError("Профиль фрилансера не найден", "NO_PROFILE");
  }

  if (user.freelancerProfile.stripeConnectAccountId) {
    return user.freelancerProfile.stripeConnectAccountId;
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: "UA",
    email: user.email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { userId },
  });

  await prisma.freelancerProfile.update({
    where: { id: user.freelancerProfile.id },
    data: { stripeConnectAccountId: account.id },
  });

  return account.id;
}

export async function createConnectOnboardingLink(
  userId: string,
  returnUrl: string,
  refreshUrl: string,
): Promise<string> {
  const accountId = await ensureFreelancerConnectAccount(userId);

  if (!stripe) {
    throw new StripeConnectError("Stripe Connect не настроен", "NOT_CONFIGURED");
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return link.url;
}

export async function syncConnectAccountStatus(accountId: string) {
  if (!stripe) return;

  const account = await stripe.accounts.retrieve(accountId);
  const payoutsEnabled = Boolean(
    account.details_submitted &&
      account.payouts_enabled &&
      account.capabilities?.transfers === "active",
  );

  await prisma.freelancerProfile.updateMany({
    where: { stripeConnectAccountId: accountId },
    data: { stripeConnectPayoutsEnabled: payoutsEnabled },
  });
}

export async function transferWithdrawalToConnect(
  userId: string,
  amountUah: number,
  paymentId: string,
): Promise<{ transferId: string } | null> {
  if (!stripeConnectEnabled || !stripe) {
    return null;
  }

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
    select: {
      stripeConnectAccountId: true,
      stripeConnectPayoutsEnabled: true,
    },
  });

  if (
    !profile?.stripeConnectAccountId ||
    !profile.stripeConnectPayoutsEnabled
  ) {
    return null;
  }

  const amountMinor = Math.round(amountUah * 100);
  if (amountMinor < 100) {
    throw new StripeConnectError("Сумма слишком мала для перевода", "AMOUNT_TOO_SMALL");
  }

  const transfer = await stripe.transfers.create({
    amount: amountMinor,
    currency: "uah",
    destination: profile.stripeConnectAccountId,
    metadata: { paymentId, userId },
  });

  return { transferId: transfer.id };
}
