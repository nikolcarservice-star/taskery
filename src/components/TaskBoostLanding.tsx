"use client";

import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { PRICING } from "@/lib/stripe-config";
import {
  TASKBOOST_PORTFOLIO_BONUS_DAYS,
  TASKBOOST_REGISTRATION_DAYS,
  taskBoostPurchaseEnabled,
} from "@/lib/taskboost-promotion";
import type { Role } from "@/generated/prisma/client";
import Link from "next/link";

const FEATURE_ICONS = [
  "search",
  "badge",
  "sparkle",
  "infinity",
  "invite",
  "support",
] as const;

type TaskBoostLandingProps = {
  isPro: boolean;
  userRole?: Role;
  stripeEnabled: boolean;
  compact?: boolean;
};

function FeatureIcon({ type }: { type: string }) {
  const className = "h-5 w-5";
  switch (type) {
    case "search":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        </svg>
      );
    case "badge":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75V14.25m0 0a3.375 3.375 0 1 1 6.75 0v4.5m-6.75 0h6.75" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      );
  }
}

function BoostBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white ${className}`}
    >
      Boost
    </span>
  );
}

export function TaskBoostLanding({
  isPro,
  userRole,
  stripeEnabled,
  compact = false,
}: TaskBoostLandingProps) {
  const dict = useDictionary();
  const boost = dict.boost;
  const l = useLocalizedPath();
  const isFreelancer = userRole === "FREELANCER" || userRole === "ADMIN";
  const priceUah = PRICING.proFreelancer.priceUah;
  const showPurchase = stripeEnabled && taskBoostPurchaseEnabled;
  const freePromoOffer = boost.freePromoOffer
    .replace("{registrationDays}", String(TASKBOOST_REGISTRATION_DAYS))
    .replace("{portfolioDays}", String(TASKBOOST_PORTFOLIO_BONUS_DAYS));

  return (
    <div className={compact ? "space-y-10" : "space-y-16"}>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <BoostBadge />
            <span className="text-sm font-medium text-indigo-100">
              {boost.tagline}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {boost.heroTitle.replace("{name}", boost.brandName)}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-indigo-100 sm:text-lg">
            {boost.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {isPro ? (
              <div className="rounded-lg bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur">
                {boost.activated}
              </div>
            ) : isFreelancer ? (
              showPurchase ? (
                <StripeCheckoutButton
                  type="pro_freelancer"
                  label={boost.connect.replace("{name}", boost.brandName)}
                  className="!rounded-lg !bg-white !px-6 !py-3 !text-base !font-semibold !text-indigo-700 hover:!bg-indigo-50"
                />
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur">
                    {freePromoOffer}
                  </div>
                  <Link
                    href={l("/dashboard/portfolio")}
                    className="inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
                  >
                    {boost.fillPortfolioCta}
                  </Link>
                </div>
              )
            ) : userRole === "CLIENT" ? (
              <Link
                href={l("/client/projects/new")}
                className="inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
              >
                {boost.publishProject}
              </Link>
            ) : (
              <Link
                href={`${l("/register")}?role=FREELANCER`}
                className="inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
              >
                {boost.registerFreelancer}
              </Link>
            )}
            {!compact && (
              <Link
                href={l("/pricing")}
                className="text-sm font-medium text-indigo-100 underline-offset-2 hover:underline"
              >
                {boost.allPricing}
              </Link>
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {boost.metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-sm"
          >
            <p className="text-2xl font-bold text-indigo-600">{item.value}</p>
            <p className="mt-1 text-sm text-zinc-600">{item.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-900">{boost.featuresTitle}</h2>
        <p className="mt-2 max-w-2xl text-zinc-600">{boost.featuresIntro}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boost.features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FeatureIcon type={FEATURE_ICONS[index] ?? "sparkle"} />
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">{boost.comparisonTitle}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[520px] w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-6 py-3">{boost.comparisonHeaders.feature}</th>
                <th className="px-6 py-3 text-center">{boost.comparisonHeaders.free}</th>
                <th className="px-6 py-3 text-center">{boost.comparisonHeaders.boost}</th>
              </tr>
            </thead>
            <tbody>
              {boost.comparison.map((row, index) => (
                <tr
                  key={row.label}
                  className={index % 2 === 1 ? "bg-zinc-50/60" : "bg-white"}
                >
                  <td className="px-6 py-3.5 text-zinc-800">{row.label}</td>
                  <td className="px-6 py-3.5 text-center">
                    {row.free ? (
                      <span className="text-emerald-600">✓</span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {row.boost ? (
                      <span className="font-medium text-indigo-600">✓</span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">{boost.faqTitle}</h2>
          <dl className="mt-6 space-y-5">
            {boost.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-zinc-900">{item.question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BoostBadge />
            <span className="text-sm font-medium text-indigo-700">{boost.sidebarRole}</span>
          </div>
          <p className="mt-4">
            {showPurchase ? (
              <>
                <span className="text-4xl font-bold text-zinc-900">
                  {priceUah} ₴
                </span>
                <span className="text-sm text-zinc-500">
                  {" "}
                  {boost.pricePerMonthShort}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-zinc-900">
                {freePromoOffer}
              </span>
            )}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-zinc-700">
            {boost.planFeatures.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="text-indigo-600">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {isPro ? (
              <p className="text-sm font-medium text-emerald-700">
                {boost.sidebarActive}
              </p>
            ) : isFreelancer ? (
              showPurchase ? (
                <StripeCheckoutButton
                  type="pro_freelancer"
                  label={boost.connect.replace(
                    "{name}",
                    `${priceUah} ₴${boost.pricePerMonthShort}`,
                  )}
                  className="w-full !rounded-lg !bg-indigo-600 !text-white hover:!bg-indigo-700"
                />
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-600">{boost.subscriptionLater}</p>
                  <Link
                    href={l("/dashboard/portfolio")}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    {boost.fillPortfolioCta}
                  </Link>
                </div>
              )
            ) : userRole === "CLIENT" ? (
              <p className="text-sm text-zinc-500">{boost.availableForFreelancers}</p>
            ) : (
              <p className="text-sm text-zinc-500">
                {boost.loginPrefix}
                <Link href={l("/login")} className="font-medium text-indigo-600 hover:underline">
                  {boost.login}
                </Link>
                {boost.loginMiddle}
                <Link
                  href={`${l("/register")}?role=FREELANCER`}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {boost.register}
                </Link>
                {boost.loginSuffix}
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

export { BoostBadge };
