import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { PageBackNav } from "@/components/PageBackNav";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

type FaqPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: FaqPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.faq.title,
    description: dict.meta.faq.description,
    path: "/faq",
    locale,
    keywords: dict.meta.faq.keywords,
  });
}

export default async function FaqPage({ params }: FaqPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd data={faqJsonLd(dict.faq)} />
      <AccountBrowsePage
        locale={locale}
        dict={dict}
        callbackUrl="/faq"
        marketingMainClassName="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-16"
      >
        <>
          <PageBackNav className="mb-4 lg:hidden" />
          <h1 className="account-mobile-title text-2xl font-bold text-zinc-900 sm:text-4xl">
            {dict.faqPage.h1}
          </h1>
          <p className="mt-3 text-sm text-zinc-600 sm:mt-4">
            {dict.faqPage.introBeforeLink}{" "}
            <Link
              href={localizedPath(locale, "/contact")}
              className="font-medium text-indigo-600 hover:underline"
            >
              {dict.faqPage.introLink}
            </Link>
            {dict.faqPage.introAfterLink}
          </p>

          <dl className="mt-8 space-y-3 sm:mt-12 sm:space-y-4">
            {dict.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:bg-white sm:p-6 sm:shadow-sm"
              >
                <dt className="text-base font-semibold text-zinc-900 sm:text-lg">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-zinc-600 sm:mt-3">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </>
      </AccountBrowsePage>
    </>
  );
}
