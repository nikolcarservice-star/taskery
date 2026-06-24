import { MyProjectsTable } from "@/components/MyProjectsTable";
import { headerGhostButtonClass } from "@/components/HeaderShell";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/session";
import Link from "next/link";

type ClientProjectsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ moderation?: string }>;
};

export async function generateMetadata({ params }: ClientProjectsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.projects;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/client/projects",
    locale,
    noIndex: true,
  });
}

export default async function ClientProjectsPage({
  params,
  searchParams,
}: ClientProjectsPageProps) {
  const locale = await requireAppLocale(params);
  const { moderation } = await searchParams;
  const dict = await getDictionary(locale);
  const p = dict.pages.client.projects;
  const l = (path: string) => localizedPath(locale, path);
  const session = await requireClient(l("/client/projects"));

  const projects = await prisma.project.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      contract: {
        include: {
          freelancer: { select: { name: true } },
        },
      },
      _count: { select: { bids: true } },
    },
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
          <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>
        </div>
        <Link
          href={l("/client/projects/new")}
          className={`inline-flex shrink-0 ${headerGhostButtonClass}`}
        >
          {p.newProject}
        </Link>
      </div>

      {moderation === "pending" && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {p.moderationPendingBanner}
        </div>
      )}

      <MyProjectsTable projects={projects} />
    </div>
  );
}
