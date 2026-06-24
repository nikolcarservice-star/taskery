"use client";

import { ClientOrderStatsPanel } from "@/components/project/ClientOrderStatsPanel";
import { CloseProjectButton } from "@/components/CloseProjectButton";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { UserAvatar } from "@/components/UserAvatar";
import type { ClientOrderStats } from "@/lib/client-stats-shared";
import {
  formatDeadlineCountdown,
} from "@/lib/project-progress";
import { formatBudget } from "@/lib/project-labels";
import { countryLabel } from "@/lib/personal-data-shared";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";
import Link from "next/link";

type ProjectSidebarProps = {
  client: {
    id: string;
    name: string | null;
    avatar: string | null;
    rating: number;
    country: string | null;
    city: string | null;
    createdAt: Date;
  };
  category: string | null;
  createdAt: Date;
  viewsCount: number;
  bidCount: number;
  deadline: Date | null;
  budget: { toString(): string } | null;
  currency: string;
  canManage: boolean;
  projectSlug: string;
  projectId: string;
  projectStatus: string;
  hasContract: boolean;
  clientStats?: ClientOrderStats | null;
  showClientStatsForFreelancer?: boolean;
};

export function ProjectSidebar({
  client,
  category,
  createdAt,
  viewsCount,
  bidCount,
  deadline,
  budget,
  currency,
  canManage,
  projectSlug,
  projectId,
  projectStatus,
  hasContract,
  clientStats,
  showClientStatsForFreelancer = false,
}: ProjectSidebarProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const location = [client.city, countryLabel(client.country)]
    .filter(Boolean)
    .join(", ");
  const rawCountdown = formatDeadlineCountdown(deadline);
  const isDeadlineExpired = Boolean(deadline && deadline.getTime() <= Date.now());
  const countdown = isDeadlineExpired
    ? dict.projectDetail.common.deadlineExpired
    : rawCountdown;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {dict.projectDetail.contractPanel.freelancerPanelClientPrefix}
        </h2>
        <div className="mt-4 flex items-start gap-3">
          <UserAvatar name={client.name} avatar={client.avatar} className="h-12 w-12" />
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900">
              {client.name ?? dict.projectDetail.common.clientFallback}
            </p>
            {location && (
              <p className="mt-0.5 text-sm text-zinc-500">{location}</p>
            )}
            <p className="mt-1 text-sm text-amber-600">
              ★ {client.rating > 0 ? client.rating.toFixed(1) : dict.projectDetail.common.newClient}
            </p>
          </div>
        </div>

        {showClientStatsForFreelancer && clientStats && (
          <ClientOrderStatsPanel stats={clientStats} />
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-zinc-500">{dict.projectDetail.common.published}</dt>
            <dd className="font-medium text-zinc-900">
              {formatRelativeTime(createdAt, dict.time)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-zinc-500">{dict.projectDetail.common.views}</dt>
            <dd className="font-medium text-zinc-900">{viewsCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-zinc-500">{dict.projectDetail.common.bids}</dt>
            <dd className="font-medium text-zinc-900">{bidCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-zinc-500">{dict.projectDetail.common.budget}</dt>
            <dd className="font-semibold tabular-nums text-emerald-700 whitespace-nowrap">
              {formatBudget(budget, currency, locale)}
            </dd>
          </div>
        </dl>
      </section>

      {countdown && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {dict.projectDetail.common.deadlineIn}
          </p>
          <p className="mt-2 text-xl font-bold text-indigo-900">{countdown}</p>
          {deadline && (
            <p className="mt-1 text-xs text-indigo-700">
              {deadline.toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </section>
      )}

      {category && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {dict.projectDetail.common.category}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {category}
            </span>
          </div>
        </section>
      )}

      {canManage && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">{dict.projectDetail.common.management}</h2>
          <div className="mt-3 space-y-2">
            <Link
              href={l(`/client/projects/${projectSlug}/edit`)}
              className="block rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              {dict.projectDetail.common.editProject}
            </Link>
            <Link
              href={l("/client/projects")}
              className="block rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
            >
              {dict.projectDetail.common.myProjects}
            </Link>
            {projectStatus === "OPEN" && !hasContract && (
              <CloseProjectButton
                projectId={projectId}
                variant="sidebar"
                label={dict.projectDetail.common.closeProject}
              />
            )}
          </div>
        </section>
      )}
    </aside>
  );
}
