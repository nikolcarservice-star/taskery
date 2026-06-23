import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { stripe, stripeEnabled, PRICING } from "@/lib/stripe-config";
import { syncConnectAccountStatus } from "@/lib/stripe-connect";
import { atomicFundContract } from "@/lib/escrow-ops";

import Stripe from "stripe";



export async function POST(request: NextRequest) {

  if (!stripeEnabled || !stripe) {

    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  }



  const body = await request.text();

  const signature = request.headers.get("stripe-signature");



  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {

    return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  }



  let event: Stripe.Event;



  try {

    event = stripe.webhooks.constructEvent(

      body,

      signature,

      process.env.STRIPE_WEBHOOK_SECRET,

    );

  } catch {

    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  }



  if (event.type === "checkout.session.completed") {

    const session = event.data.object as Stripe.Checkout.Session;

    await handleCheckoutCompleted(session);

  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    await syncConnectAccountStatus(account.id);
  }

  if (event.type === "customer.subscription.deleted") {

    const subscription = event.data.object as Stripe.Subscription;

    const userId = subscription.metadata?.userId;

    if (userId) {

      await prisma.user.update({

        where: { id: userId },

        data: { subscriptionPlan: "FREE" },

      });

    }

  }



  if (event.type === "customer.subscription.updated") {

    const subscription = event.data.object as Stripe.Subscription;

    const userId = subscription.metadata?.userId;

    if (userId && subscription.status === "active") {

      const featuredUntil = new Date();

      featuredUntil.setDate(featuredUntil.getDate() + 30);

      await prisma.user.update({

        where: { id: userId },

        data: { subscriptionPlan: "PRO", featuredUntil },

      });

    }

  }



  return NextResponse.json({ received: true });

}



async function claimCompletedPayment(stripeSessionId: string) {

  const result = await prisma.payment.updateMany({

    where: { stripeSessionId, status: "PENDING" },

    data: { status: "COMPLETED" },

  });

  return result.count === 1;

}



async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {

  const userId = session.metadata?.userId;

  const type = session.metadata?.type;



  if (!userId || !type || !session.id) return;



  const claimed = await claimCompletedPayment(session.id);

  if (!claimed) return;



  await prisma.payment.updateMany({

    where: { stripeSessionId: session.id },

    data: {

      stripePaymentIntentId:

        typeof session.payment_intent === "string"

          ? session.payment_intent

          : session.payment_intent?.id,

    },

  });



  switch (type) {

    case "topup": {

      const metadataAmount = Number(session.metadata?.amount ?? 0);

      const paidAmount =

        session.amount_total != null

          ? session.amount_total / 100

          : metadataAmount;

      const amount = Math.min(metadataAmount, paidAmount);



      if (amount > 0) {

        await prisma.user.update({

          where: { id: userId },

          data: { balance: { increment: amount } },

        });

      }

      break;

    }

    case "fund_escrow": {

      const metadataAmount = Number(session.metadata?.amount ?? 0);

      const contractId = session.metadata?.contractId;

      const projectId = session.metadata?.projectId;



      const paidAmount =

        session.amount_total != null

          ? session.amount_total / 100

          : metadataAmount;

      const amount = Math.min(metadataAmount, paidAmount);



      if (amount <= 0 || !contractId || !projectId) {

        break;

      }



      await prisma.$transaction(async (tx) => {

        await tx.user.update({

          where: { id: userId },

          data: { balance: { increment: amount } },

        });

      });



      try {

        await atomicFundContract(contractId, userId, amount);

      } catch {

        // Payment received; client can fund manually from balance.

      }

      break;

    }

    case "pro_freelancer": {

      const featuredUntil = new Date();

      featuredUntil.setDate(featuredUntil.getDate() + 30);

      await prisma.user.update({

        where: { id: userId },

        data: {

          subscriptionPlan: "PRO",

          featuredUntil,

        },

      });

      break;

    }

    case "feature_project": {

      const projectId = session.metadata?.projectId;

      if (projectId) {

        const until = new Date();

        until.setDate(until.getDate() + PRICING.featureProject.days);

        await prisma.project.updateMany({

          where: { id: projectId, clientId: userId },

          data: { isFeatured: true, featuredUntil: until },

        });

      }

      break;

    }

    case "feature_profile": {

      const until = new Date();

      until.setDate(until.getDate() + PRICING.featureProfile.days);

      await prisma.user.update({

        where: { id: userId },

        data: { featuredUntil: until },

      });

      break;

    }

  }

}


