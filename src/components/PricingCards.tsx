"use client";

import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { PRICING } from "@/lib/stripe-config";
import { Role } from "@/generated/prisma/client";

type PricingCardsProps = {
  userRole?: Role;
  isPro?: boolean;
  stripeEnabled: boolean;
};

export function PricingCards({
  userRole,
  isPro = false,
  stripeEnabled,
}: PricingCardsProps) {
  const dict = useDictionary();
  const cards = [
    {
      key: "free",
      name: dict.pricingUi.cards.freeName,
      price: "0 ₴",
      period: dict.pricingUi.cards.freePeriod,
      features: dict.pricingUi.cards.freeFeatures,
      cta: null,
    },
    {
      key: "pro_freelancer",
      name: PRICING.proFreelancer.name,
      price: `${PRICING.proFreelancer.priceUah} ₴`,
      period: "/ month",
      features: PRICING.proFreelancer.features,
      cta: "pro_freelancer" as const,
      forRole: "FREELANCER" as const,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {cards.map((card) => {
        const showCta =
          card.cta &&
          stripeEnabled &&
          !isPro &&
          (userRole === card.forRole || userRole === "ADMIN");

        return (
          <div
            key={card.key}
            className={`rounded-2xl border p-6 shadow-sm ${
              card.key === "pro_freelancer"
                ? "border-indigo-200 bg-gradient-to-b from-indigo-50 to-white"
                : card.key.startsWith("pro")
                  ? "border-amber-200 bg-gradient-to-b from-amber-50 to-white"
                  : "border-zinc-200 bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-zinc-900">{card.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-bold text-zinc-900">
                {card.price}
              </span>
              <span className="text-sm text-zinc-500">{card.period}</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600">
              {card.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {isPro && card.key === "pro_freelancer" ? (
              <p className="mt-6 text-sm font-medium text-green-700">
                {dict.pricingUi.cards.activeBoost}
              </p>
            ) : showCta ? (
              <div className="mt-6">
                <StripeCheckoutButton
                  type={card.cta}
                  label={`${dict.pricingUi.cards.connectPrefix} ${card.name}`}
                  className="w-full"
                />
              </div>
            ) : card.key === "free" ? (
              <p className="mt-6 text-sm text-zinc-500">
                {dict.pricingUi.cards.freeAvailable}
              </p>
            ) : (
              <p className="mt-6 text-sm text-zinc-500">
                {userRole
                  ? dict.pricingUi.cards.roleRestricted
                  : dict.pricingUi.cards.loginToConnect}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PremiumFeaturesSection({ stripeEnabled }: { stripeEnabled: boolean }) {
  const dict = useDictionary();
  if (!stripeEnabled) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-zinc-900">{dict.pricingUi.premiumFeatures.title}</h2>
      <p className="mt-2 text-zinc-600">
        {dict.pricingUi.premiumFeatures.intro}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="font-semibold text-zinc-900">
            {PRICING.featureProject.name}
          </h3>
          <p className="mt-1 text-2xl font-bold">
            {PRICING.featureProject.priceUah} ₴
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {dict.pricingUi.premiumFeatures.projectTopForDays.replace("{days}", String(PRICING.featureProject.days))}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="font-semibold text-zinc-900">
            {PRICING.featureProfile.name}
          </h3>
          <p className="mt-1 text-2xl font-bold">
            {PRICING.featureProfile.priceUah} ₴
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {dict.pricingUi.premiumFeatures.profileFeaturedForDays.replace("{days}", String(PRICING.featureProfile.days))}
          </p>
        </div>
      </div>
    </section>
  );
}
