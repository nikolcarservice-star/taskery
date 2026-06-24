import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { PageBackNav } from "@/components/PageBackNav";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters } from "@/components/ProjectFilters";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import {
  buildOpenContestsWhere,
  getProjectOrderBy,
  type ProjectSearchParams,
} from "@/lib/queries/projects";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";

type ContestsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ProjectSearchParams>;
};

export async function generateMetadata({ params }: ContestsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.contests.h1,
    description: dict.contests.intro,
    path: "/contests",
    locale,
  });
}

export default async function ContestsPage({
  params,
  searchParams,
}: ContestsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const query = await searchParams;
  const where = buildOpenContestsWhere(query);

  const [contests, categories] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: getProjectOrderBy(query.sort),
      include: {
        category: { select: { name: true } },
        contestEscrow: true,
        _count: { select: { contestEntries: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <AccountBrowsePage locale={locale} dict={dict} callbackUrl="/contests">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="account-mobile-title text-2xl font-bold text-zinc-900 sm:text-3xl">
            {dict.contests.h1}
          </h1>
          <Link
            href={localizedPath(locale, "/client/contests/new")}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            {dict.contests.createCta}
          </Link>
        </div>
        <p className="mt-2 text-sm text-zinc-600">{dict.contests.intro}</p>

        <Suspense fallback={null}>
          <ProjectFilters categories={categories} />
        </Suspense>

        <div className="mt-6 space-y-4">
          {contests.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
              <p className="font-medium text-zinc-900">{dict.contests.emptyTitle}</p>
              <p className="mt-1 text-sm text-zinc-500">{dict.contests.emptyText}</p>
            </div>
          ) : (
            contests.map((contest) => (
              <ProjectCard
                key={contest.id}
                locale={locale}
                project={{
                  ...contest,
                  _count: { bids: contest._count.contestEntries },
                }}
              />
            ))
          )}
        </div>
      </div>
    </AccountBrowsePage>
  );
}
