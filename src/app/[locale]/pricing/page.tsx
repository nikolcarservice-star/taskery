import { PremiumFeaturesSection, PricingCards } from "@/components/PricingCards";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { PageBackNav } from "@/components/PageBackNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";
import { toPricingDisplay } from "@/lib/pricing-display";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/slug";
import {
  TASKBOOST_PORTFOLIO_BONUS_DAYS,
  TASKBOOST_REGISTRATION_DAYS,
  taskBoostPurchaseEnabled,
} from "@/lib/taskboost-promotion.constants";
import { PRICING, stripeEnabled } from "@/lib/stripe-config";

type PricingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PricingPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.pricing.title,
    description: dict.meta.pricing.description,
    path: "/pricing",
    locale,
    keywords: dict.meta.pricing.keywords,
  });
}

export default async function PricingPage({ params }: PricingPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const session = await auth();
  let isPro = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionPlan: true, featuredUntil: true },
    });
    isPro = user
      ? isProUser(user.subscriptionPlan, user.featuredUntil)
      : false;
  }

  const pricing = toPricingDisplay(PRICING);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <JsonLd data={faqJsonLd(dict.faq.slice(0, 3))} />
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <PageBackNav />
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-zinc-900">{dict.pricing.h1}</h1>
          <p className="mt-4 text-lg text-zinc-600">{dict.pricing.intro}</p>
        </div>

        <div className="mt-12">
          <PricingCards
            userRole={session?.user?.role}
            isPro={isPro}
            stripeEnabled={stripeEnabled && taskBoostPurchaseEnabled}
            taskBoostPurchaseEnabled={taskBoostPurchaseEnabled}
            taskBoostRegistrationDays={TASKBOOST_REGISTRATION_DAYS}
            taskBoostPortfolioDays={TASKBOOST_PORTFOLIO_BONUS_DAYS}
            pricing={pricing}
          />
        </div>

        <PremiumFeaturesSection stripeEnabled={stripeEnabled} pricing={pricing} />

        <section className="mt-16 rounded-2xl border border-zinc-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-zinc-900">
            {dict.pricing.commissionTitle}
          </h2>
          <p className="mt-3 text-zinc-600">{dict.pricing.commissionText}</p>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
