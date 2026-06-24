import { ContestForm } from "@/components/ContestForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/session";

type NewContestPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewContestPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.contests.createCta,
    description: dict.contests.intro,
    path: "/client/contests/new",
    locale,
    noIndex: true,
  });
}

export default async function ClientNewContestPage({ params }: NewContestPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  await requireClient(localizedPath(locale, "/client/contests/new"));

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{dict.contests.createCta}</h1>
      <p className="mt-2 text-sm text-zinc-600">{dict.contests.intro}</p>

      <div className="mt-8">
        <ContestForm categories={categories} />
      </div>
    </div>
  );
}
