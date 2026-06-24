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

function refundedAmount(metadata: Record<string, unknown> | null | undefined): number {
  return Number(metadata?.refundedAmount ?? 0);
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

async function refundStripePaymentAmount(
  payment: Payment,
  refundAmount: number,
): Promise<{ refunded: boolean; refundedAmount: number }> {
  if (!stripeEnabled || !stripe || !payment.stripePaymentIntentId) {
    return { refunded: false, refundedAmount: 0 };
  }

  if (payment.status === "REFUNDED") {
    throw new StripeRefundError(
      "Возврат по Stripe уже выполнен",
      "ALREADY_REFUNDED",
    );
  }

  const metadata = (payment.metadata as Record<string, unknown> | null) ?? {};
  const paidAmount = Number(payment.amount);
  const alreadyRefunded = refundedAmount(metadata);
  const remaining =
    Math.round((paidAmount - alreadyRefunded) * 100) / 100;
  const amount = Math.min(
    Math.round(refundAmount * 100) / 100,
    remaining,
  );

  if (amount <= 0) {
    return { refunded: false, refundedAmount: 0 };
  }

  try {
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(amount * 100),
    });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new StripeRefundError(error.message, "STRIPE_ERROR");
    }
    throw error;
  }

  const totalRefunded =
    Math.round((alreadyRefunded + amount) * 100) / 100;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: totalRefunded >= paidAmount - 0.01 ? "REFUNDED" : "COMPLETED",
      metadata: {
        ...metadata,
        refundedAmount: totalRefunded,
      },
    },
  });

  return { refunded: true, refundedAmount: amount };
}

export async function refundStripeEscrowFunding(
  contractId: string,
  clientId: string,
): Promise<{ refunded: boolean; paymentIntentId?: string }> {
  const payment = await findStripeEscrowFundingPayment(contractId, clientId);
  if (!payment) {
    return { refunded: false };
  }

  const result = await refundStripePaymentAmount(
    payment,
    Number(payment.amount),
  );

  return {
    refunded: result.refunded,
    paymentIntentId: payment.stripePaymentIntentId ?? undefined,
  };
}

export async function refundStripeEscrowFundingPartial(
  contractId: string,
  clientId: string,
  refundAmount: number,
): Promise<{ refunded: boolean; refundedAmount: number }> {
  const payment = await findStripeEscrowFundingPayment(contractId, clientId);
  if (!payment) {
    return { refunded: false, refundedAmount: 0 };
  }

  return refundStripePaymentAmount(payment, refundAmount);
}
