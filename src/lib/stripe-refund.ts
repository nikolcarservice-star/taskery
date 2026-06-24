import type { Payment } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe, stripeEnabled } from "@/lib/stripe-config";
import Stripe from "stripe";

export class StripeRefundError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_CONFIGURED" | "NOT_FOUND" | "ALREADY_REFUNDED" | "STRIPE_ERROR",
  ) {
    super(message);
    this.name = "StripeRefundError";
  }
}

function isFundEscrowPayment(payment: Payment): boolean {
  const metadata = payment.metadata as Record<string, unknown> | null;
  return metadata?.type === "fund_escrow" && typeof metadata?.contractId === "string";
}

export async function findStripeEscrowFundingPayment(
  contractId: string,
  clientId: string,
) {
  const payments = await prisma.payment.findMany({
    where: {
      userId: clientId,
      status: { in: ["COMPLETED", "REFUNDED"] },
      stripePaymentIntentId: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return payments.find((payment) => {
    if (!isFundEscrowPayment(payment)) return false;
    const metadata = payment.metadata as Record<string, unknown>;
    return metadata.contractId === contractId;
  });
}

export async function refundStripeEscrowFunding(
  contractId: string,
  clientId: string,
): Promise<{ refunded: boolean; paymentIntentId?: string }> {
  if (!stripeEnabled || !stripe) {
    return { refunded: false };
  }

  const payment = await findStripeEscrowFundingPayment(contractId, clientId);
  if (!payment?.stripePaymentIntentId) {
    return { refunded: false };
  }

  if (payment.status === "REFUNDED") {
    throw new StripeRefundError(
      "Возврат по Stripe уже выполнен",
      "ALREADY_REFUNDED",
    );
  }

  try {
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new StripeRefundError(error.message, "STRIPE_ERROR");
    }
    throw error;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "REFUNDED" },
  });

  return { refunded: true, paymentIntentId: payment.stripePaymentIntentId };
}
