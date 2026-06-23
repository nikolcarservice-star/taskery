import { PageBackNav } from "@/components/PageBackNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return createMetadata({
    title: dict.legal.terms.title,
    description: dict.legal.terms.sections[0]?.body ?? dict.legal.terms.title,
    path: "/terms",
    locale,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <PageBackNav />
        <h1 className="mt-4 text-3xl font-bold text-zinc-900">{dict.legal.terms.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">{dict.legal.terms.updatedAt}</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-700">
          {dict.legal.terms.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-zinc-900">{section.heading}</h2>
              <p className="mt-2">{section.body}</p>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
