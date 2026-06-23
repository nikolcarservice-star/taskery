import { PersonalDataSettings } from "@/components/PersonalDataSettings";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { getPersonalData } from "@/lib/personal-data";
import { requireClient } from "@/lib/session";
import { Suspense } from "react";

type ClientPersonalPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ClientPersonalPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.personal;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/client/personal",
    locale,
    noIndex: true,
  });
}

function PersonalDataFallback() {
  return <div className="mt-6 h-40 animate-pulse rounded-xl bg-zinc-100" />;
}

export default async function ClientPersonalPage({ params }: ClientPersonalPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.personal;
  const session = await requireClient(localizedPath(locale, "/client/personal"));
  const data = await getPersonalData(session.user.id);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <Suspense fallback={<PersonalDataFallback />}>
        <PersonalDataSettings data={data} />
      </Suspense>
    </div>
  );
}
