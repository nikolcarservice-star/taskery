import { JsonLd, organizationJsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    path: "/about",
    locale,
    keywords: dict.meta.about.keywords,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { about } = dict;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <JsonLd data={organizationJsonLd()} />
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-4xl font-bold text-zinc-900">{about.h1}</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600">{about.intro}</p>

        <section className="mt-12 space-y-6 text-zinc-700">
          <h2 className="text-2xl font-semibold text-zinc-900">{about.clientsTitle}</h2>
          <p className="leading-7">{about.clientsText}</p>

          <h2 className="text-2xl font-semibold text-zinc-900">{about.freelancersTitle}</h2>
          <p className="leading-7">{about.freelancersText}</p>

          <h2 className="text-2xl font-semibold text-zinc-900">{about.securityTitle}</h2>
          <p className="leading-7">{about.securityText}</p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href={localizedPath(locale, "/register")}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            {dict.common.createAccount}
          </Link>
          <Link
            href={localizedPath(locale, "/contact")}
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-white"
          >
            {dict.common.contactUs}
          </Link>
        </div>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
