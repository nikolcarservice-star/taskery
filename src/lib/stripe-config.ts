import "server-only";

import Stripe from "stripe";

export const PRICING = {
  proFreelancer: {
    name: "TaskBoost",
    priceUah: 299,
    priceId: process.env.STRIPE_PRICE_PRO_FREELANCER,
    features: [
      "Бейдж TaskBoost в каталоге",
      "Приоритет в поиске исполнителей",
      "Выделенный профиль 30 дней",
      "Безлимитные отклики",
    ],
  },
  featureProject: {
    name: "Поднять проект",
    priceUah: 149,
    priceId: process.env.STRIPE_PRICE_FEATURE_PROJECT,
    days: 7,
  },
  featureProfile: {
    name: "Выделить профиль",
    priceUah: 99,
    priceId: process.env.STRIPE_PRICE_FEATURE_PROFILE,
    days: 14,
  },
  minTopUpUah: 100,
  maxTopUpUah: 100000,
} as const;

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripeConnectEnabled = Boolean(
  stripeEnabled && process.env.STRIPE_CONNECT_ENABLED === "true",
);

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    })
  : null;
