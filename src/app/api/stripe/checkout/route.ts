import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/i18n/currencies";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/seo";
import {
  buildStripePriceData,
  resolveStripeCurrency,
  validateTopUpAmount,
} from "@/lib/stripe-checkout";
import { stripe, stripeEnabled, PRICING } from "@/lib/stripe-config";
import { taskBoostPurchaseEnabled } from "@/lib/taskboost-promotion.constants";

type CheckoutBody = {
  type: string;
  amount?: number;
  projectId?: string;
};

async function loadOwnedProject(projectId: string, userId: string, isAdmin: boolean) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      budget: true,
      currency: true,
      clientId: true,
      contract: {
        select: {
          id: true,
          amount: true,
          status: true,
        },
      },
    },
  });

  if (!project) {
    return { error: "Проект не найден" as const };
  }

  if (project.clientId !== userId && !isAdmin) {
    return { error: "Нет доступа к проекту" as const };
  }

  const currency = resolveStripeCurrency(project.currency);
  if (!currency) {
    return { error: "У проекта некорректная валюта" as const };
  }

  return { project, currency };
}

export async function POST(request: NextRequest) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json(
      { error: "Stripe не настроен. Добавьте STRIPE_SECRET_KEY в .env" },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const limited = checkRateLimit(`stripe-checkout:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return rateLimitResponse(limited.retryAfterSec);
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CheckoutBody;
  const { type, amount, projectId } = body;

  let user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    user = await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const successUrl = absoluteUrl("/billing/success?session_id={CHECKOUT_SESSION_ID}");
  const cancelUrl = absoluteUrl("/pricing");

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let metadata: Record<string, string> = {
    userId: user.id,
    type,
  };
  let mode: "payment" | "subscription" = "payment";
  let paymentAmount: number = PRICING.proFreelancer.priceUah;
  let paymentCurrency = "UAH";

  switch (type) {
    case "topup": {
      if (session.user.role !== "CLIENT" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Только для заказчиков" }, { status: 403 });
      }

      let topupCurrency = resolveStripeCurrency("UAH")!;
      let topupAmount = Number(amount);

      if (projectId) {
        const loaded = await loadOwnedProject(
          projectId,
          user.id,
          session.user.role === "ADMIN",
        );
        if ("error" in loaded) {
          return NextResponse.json({ error: loaded.error }, { status: 400 });
        }

        topupCurrency = loaded.currency;
        metadata.projectId = projectId;
        metadata.currency = topupCurrency;
      }

      const topupError = validateTopUpAmount(topupAmount, topupCurrency);
      if (topupError) {
        return NextResponse.json({ error: topupError }, { status: 400 });
      }

      metadata.amount = String(topupAmount);
      metadata.currency = topupCurrency;
      paymentAmount = topupAmount;
      paymentCurrency = topupCurrency;

      lineItems = [
        {
          price_data: buildStripePriceData(
            topupAmount,
            topupCurrency,
            "Пополнение баланса Taskery",
            `Пополнение на ${formatMoney(topupAmount, topupCurrency)}`,
          ),
          quantity: 1,
        },
      ];
      break;
    }
    case "fund_escrow": {
      if (session.user.role !== "CLIENT" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Только для заказчиков" }, { status: 403 });
      }
      if (!projectId) {
        return NextResponse.json({ error: "projectId required" }, { status: 400 });
      }

      const loaded = await loadOwnedProject(
        projectId,
        user.id,
        session.user.role === "ADMIN",
      );
      if ("error" in loaded) {
        return NextResponse.json({ error: loaded.error }, { status: 400 });
      }

      const { project, currency } = loaded;

      if (!project.contract) {
        return NextResponse.json({ error: "Контракт не найден" }, { status: 400 });
      }

      if (project.contract.status !== "AWAITING_FUNDING") {
        return NextResponse.json(
          { error: "Эскроу по этому проекту уже оплачен или недоступен" },
          { status: 400 },
        );
      }

      const escrowAmount = Number(project.contract.amount);
      if (!Number.isFinite(escrowAmount) || escrowAmount <= 0) {
        return NextResponse.json({ error: "Некорректная сумма контракта" }, { status: 400 });
      }

      metadata.projectId = projectId;
      metadata.contractId = project.contract.id;
      metadata.amount = String(escrowAmount);
      metadata.currency = currency;
      paymentAmount = escrowAmount;
      paymentCurrency = currency;

      lineItems = [
        {
          price_data: buildStripePriceData(
            escrowAmount,
            currency,
            "Эскроу Taskery",
            `Внесение ${formatMoney(escrowAmount, currency)} в эскроу: ${project.title}`,
          ),
          quantity: 1,
        },
      ];
      break;
    }
    case "pro_freelancer": {
      if (!taskBoostPurchaseEnabled) {
        return NextResponse.json(
          { error: "Покупка TaskBoost временно недоступна" },
          { status: 403 },
        );
      }
      if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Только для фрилансеров" }, { status: 403 });
      }
      mode = "subscription";
      paymentAmount = PRICING.proFreelancer.priceUah;
      paymentCurrency = "UAH";
      lineItems = PRICING.proFreelancer.priceId
        ? [{ price: PRICING.proFreelancer.priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "uah",
                recurring: { interval: "month" },
                product_data: { name: PRICING.proFreelancer.name },
                unit_amount: PRICING.proFreelancer.priceUah * 100,
              },
              quantity: 1,
            },
          ];
      break;
    }
    case "feature_project": {
      if (session.user.role !== "CLIENT" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Только для заказчиков" }, { status: 403 });
      }
      if (!projectId) {
        return NextResponse.json({ error: "projectId required" }, { status: 400 });
      }
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { clientId: true },
      });
      if (
        !project ||
        (project.clientId !== user.id && session.user.role !== "ADMIN")
      ) {
        return NextResponse.json({ error: "Проект не найден" }, { status: 403 });
      }
      metadata.projectId = projectId;
      paymentAmount = PRICING.featureProject.priceUah;
      paymentCurrency = "UAH";
      lineItems = PRICING.featureProject.priceId
        ? [{ price: PRICING.featureProject.priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "uah",
                product_data: { name: PRICING.featureProject.name },
                unit_amount: PRICING.featureProject.priceUah * 100,
              },
              quantity: 1,
            },
          ];
      break;
    }
    case "feature_profile": {
      if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Только для фрилансеров" }, { status: 403 });
      }
      paymentAmount = PRICING.featureProfile.priceUah;
      paymentCurrency = "UAH";
      lineItems = PRICING.featureProfile.priceId
        ? [{ price: PRICING.featureProfile.priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "uah",
                product_data: { name: PRICING.featureProfile.name },
                unit_amount: PRICING.featureProfile.priceUah * 100,
              },
              quantity: 1,
            },
          ];
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: user.stripeCustomerId!,
    mode,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    ...(mode === "subscription" ? { subscription_data: { metadata } } : {}),
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: paymentAmount,
      type:
        type === "topup" || type === "fund_escrow"
          ? "BALANCE_TOPUP"
          : type === "feature_project"
              ? "FEATURE_PROJECT"
              : type === "feature_profile"
                ? "FEATURE_PROFILE"
                : "SUBSCRIPTION",
      status: "PENDING",
      stripeSessionId: checkoutSession.id,
      metadata: {
        ...metadata,
        currency: paymentCurrency,
      },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
