import { JsonLd, faqJsonLd, homePageJsonLd } from "@/components/JsonLd";
import { LandingClientsSection } from "@/components/LandingClientsSection";
import { LandingFaqSection } from "@/components/LandingFaqSection";
import { LandingFreelancersSection } from "@/components/LandingFreelancersSection";
import { LandingHero } from "@/components/LandingHero";
import { LandingHowItWorksSection } from "@/components/LandingHowItWorksSection";
import { LandingSafetySection } from "@/components/LandingSafetySection";
import { LandingVerifiedSection } from "@/components/LandingVerifiedSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { auth } from "@/lib/auth";
import { APP_LOCALES } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import Link from "next/link";
import { redirect } from "next/navigation";

type LocaleHomePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return APP_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleHomePageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    path: "/",
    locale,
    keywords: dict.meta.home.keywords,
  });
}

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const locale = await requireAppLocale(params);
  const session = await auth();

  if (session?.user) {
    redirect(getHomeRouteForRole(session.user.role, locale));
  }

  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <JsonLd
        data={[
          ...homePageJsonLd({
            title: dict.meta.home.title,
            description: dict.meta.home.description,
            locale,
          }),
          faqJsonLd(dict.faq),
        ]}
      />
      <SiteHeader locale={locale} dict={dict} />

      <main id="main-content">
        <LandingHero locale={locale} dict={dict} />
        <LandingClientsSection locale={locale} dict={dict} />
        <LandingHowItWorksSection dict={dict} />
        <LandingSafetySection dict={dict} />
        <LandingVerifiedSection locale={locale} dict={dict} />
        <LandingFreelancersSection locale={locale} dict={dict} />
        <LandingFaqSection locale={locale} dict={dict} />

        <section
          aria-labelledby="landing-cta-title"
          className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20"
        >
          <h2 id="landing-cta-title" className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            {dict.landing.cta.title}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-base">
            {dict.landing.cta.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href={localizedPath(locale, "/register")}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 sm:w-auto"
            >
              {dict.landing.cta.register}
            </Link>
            <Link
              href={localizedPath(locale, "/pricing")}
              className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 sm:w-auto"
            >
              {dict.landing.cta.pricing}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
