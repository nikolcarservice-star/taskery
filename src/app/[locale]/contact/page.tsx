import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { ContactForm } from "@/components/ContactForm";
import { PageBackNav } from "@/components/PageBackNav";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { contact } = dict;

  return (
    <AccountBrowsePage
      locale={locale}
      dict={dict}
      callbackUrl="/contact"
      marketingMainClassName="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-16"
    >
      <>
        <PageBackNav className="mb-4 lg:hidden" />
        <h1 className="account-mobile-title text-2xl font-bold text-zinc-900 sm:text-4xl">
          {contact.h1}
        </h1>
        <p className="mt-3 text-sm text-zinc-600 sm:mt-4">{contact.intro}</p>

        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:bg-white sm:p-6 sm:shadow-sm">
            <h2 className="font-semibold text-zinc-900">{contact.supportTitle}</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {contact.supportEmailLabel}:{" "}
              <a
                href={`mailto:${siteConfig.emails.support}`}
                className="font-medium text-indigo-600 hover:underline"
              >
                {siteConfig.emails.support}
              </a>
            </p>
            <p className="mt-4 text-sm text-zinc-600">{contact.proSupport}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:bg-white sm:p-6 sm:shadow-sm">
            <ContactForm />
          </div>
        </div>
      </>
    </AccountBrowsePage>
  );
}
