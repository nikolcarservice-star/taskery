"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import {
  bidStatusColors,
  formatBudget,
  projectStatusColors,
} from "@/lib/project-labels";
import type { BidStatus, ProjectStatus } from "@/generated/prisma/client";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

export type MyBidRow = {
  id: string;
  cost: string;
  timeframe: number;
  status: BidStatus;
  createdAt: string;
  project: {
    slug: string;
    title: string;
    status: ProjectStatus;
    budget: string | null;
    currency: string;
    deadline: string | null;
  };
};

type MyBidsTableProps = {
  bids: MyBidRow[];
};

function formatAddedAt(iso: string, locale: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });
}

function formatDays(days: number, t: ReturnType<typeof useDictionary>["tables"]["bids"]) {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return t.dayOne.replace("{count}", String(days));
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return t.dayFew.replace("{count}", String(days));
  }
  return t.dayMany.replace("{count}", String(days));
}

function bidCountLabel(
  count: number,
  t: ReturnType<typeof useDictionary>["tables"]["bids"],
) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return t.countOne;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return t.countFew;
  }
  return t.countMany;
}

function ProjectStatusIcon({
  status,
  label,
}: {
  status: ProjectStatus;
  label: string;
}) {
  const config: Record<ProjectStatus, { className: string; icon: ReactNode }> = {
    OPEN: {
      className: "bg-emerald-50 text-emerald-600",
      icon: (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    IN_PROGRESS: {
      className: "bg-blue-50 text-blue-600",
      icon: (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    CLOSED: {
      className: "bg-zinc-100 text-zinc-500",
      icon: (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    PENDING_MODERATION: {
      className: "bg-amber-50 text-amber-700",
      icon: (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    UNDER_DISPUTE: {
      className: "bg-red-50 text-red-600",
      icon: (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
    },
  };

  const item = config[status];

  return (
    <span
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.className}`}
    >
      {item.icon}
    </span>
  );
}

function BidStatusBadge({
  status,
  labels,
}: {
  status: BidStatus;
  labels: Record<BidStatus, string>;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${bidStatusColors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function MyBidsTable({ bids }: MyBidsTableProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const t = dict.tables.bids;
  const bidStatusLabels = dict.labels.bidStatus;
  const projectStatusLabels = dict.labels.projectStatus;
  const [onlyActive, setOnlyActive] = useState(true);

  const filtered = useMemo(() => {
    if (!onlyActive) return bids;
    return bids.filter(
      (bid) => bid.status === "PENDING" && bid.project.status === "OPEN",
    );
  }, [bids, onlyActive]);

  if (bids.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center">
        <p className="text-lg font-semibold text-zinc-900">{t.emptyTitle}</p>
        <p className="mt-2 text-sm text-zinc-500">{t.emptyBody}</p>
        <Link
          href={l("/projects")}
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          {t.findProject}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-zinc-600">
          <select
            value={onlyActive ? "active" : "all"}
            onChange={(event) => setOnlyActive(event.target.value === "active")}
            className="rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-9 text-sm text-zinc-800 shadow-sm outline-none transition-colors hover:border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="active">{t.filterActive}</option>
            <option value="all">{t.filterAll}</option>
          </select>
        </label>
        <p className="text-sm text-zinc-500">
          {filtered.length} {bidCountLabel(filtered.length, t)}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
          {t.noActive}{" "}
          <button
            type="button"
            onClick={() => setOnlyActive(false)}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            {t.showAll}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col style={{ width: "42%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "30%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/90 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3.5 font-semibold sm:px-5">{t.colProject}</th>
                <th className="hidden px-4 py-3.5 font-semibold sm:table-cell sm:px-5">
                  {t.colBudget}
                </th>
                <th className="px-4 py-3.5 font-semibold sm:px-5">{t.colAdded}</th>
                <th className="px-4 py-3.5 font-semibold sm:px-5">{t.colOffer}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((bid) => (
                <tr
                  key={bid.id}
                  className="transition-colors hover:bg-zinc-50/80"
                >
                  <td className="px-4 py-4 sm:px-5">
                    <div className="flex items-start gap-3">
                      <ProjectStatusIcon
                        status={bid.project.status}
                        label={projectStatusLabels[bid.project.status]}
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={l(`/projects/${bid.project.slug}`)}
                          className="line-clamp-2 font-medium leading-snug text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          {bid.project.title}
                        </Link>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <BidStatusBadge status={bid.status} labels={bidStatusLabels} />
                        </div>
                        <p className="mt-1.5 text-xs text-zinc-500 sm:hidden">
                          {t.budgetLabel}{" "}
                          {bid.project.budget
                            ? formatBudget(
                                { toString: () => bid.project.budget! },
                                bid.project.currency,
                                locale,
                              )
                            : t.budgetUnset}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 tabular-nums text-zinc-700 sm:table-cell sm:px-5">
                    {bid.project.budget
                      ? formatBudget(
                          { toString: () => bid.project.budget! },
                          bid.project.currency,
                          locale,
                        )
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 tabular-nums text-zinc-600 sm:px-5">
                    {formatAddedAt(bid.createdAt, locale)}
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                      <span className="inline-flex w-fit rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white tabular-nums">
                        {formatBudget(
                          { toString: () => bid.cost },
                          bid.project.currency,
                          locale,
                        )}
                      </span>
                      <span className="inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {formatDays(bid.timeframe, t)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
