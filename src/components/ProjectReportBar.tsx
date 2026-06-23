"use client";

import { ReportDialog } from "@/components/ReportDialog";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { localizedPath } from "@/lib/i18n/routing";
import type { AppLocale } from "@/lib/i18n/types";
import {
  getProjectReportBadge,
  UNDERPRICED_REPORT_THRESHOLD,
} from "@/lib/reports-shared";
import Link from "next/link";
import { useState } from "react";

type ProjectReportBarProps = {
  locale: AppLocale;
  projectId: string;
  projectSlug: string;
  reportCount: number;
  underpricedReportCount: number;
  moderationHot: boolean;
  hiddenFromCatalog: boolean;
  canReport: boolean;
  alreadyReported: boolean;
  isOwner: boolean;
};

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 21V4h2v3h9.5l-1.5 4 1.5 4H7v10H5zm2-10h8.2l-.9-2.4L15 6H7v5z" />
    </svg>
  );
}

export function ProjectReportBar({
  locale,
  projectId,
  projectSlug,
  reportCount,
  underpricedReportCount,
  moderationHot,
  hiddenFromCatalog,
  canReport,
  alreadyReported,
  isOwner,
}: ProjectReportBarProps) {
  const dict = useDictionary();
  const t = dict.reports;
  const [open, setOpen] = useState(false);
  const threshold = UNDERPRICED_REPORT_THRESHOLD;
  const barCount = Math.min(underpricedReportCount, threshold);
  const barPercent = threshold > 0 ? Math.round((barCount / threshold) * 100) : 0;
  const badge = getProjectReportBadge(
    reportCount,
    underpricedReportCount,
    moderationHot,
  );

  if (isOwner) {
    if (!moderationHot && !hiddenFromCatalog && reportCount === 0) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {hiddenFromCatalog || moderationHot
          ? t.ownerHiddenNotice
          : t.ownerReportsNotice.replace("{count}", String(reportCount))}
      </div>
    );
  }

  return (
    <>
      <div
        className={`rounded-2xl border px-4 py-3 sm:px-5 ${
          badge === "hot"
            ? "border-red-200 bg-red-50"
            : badge === "warning"
              ? "border-amber-200 bg-amber-50"
              : "border-zinc-200 bg-zinc-50"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FlagIcon
                className={`h-4 w-4 shrink-0 ${
                  badge === "hot"
                    ? "text-red-600"
                    : badge === "warning"
                      ? "text-amber-600"
                      : "text-zinc-400"
                }`}
              />
              <p className="text-sm font-medium text-zinc-900">
                {moderationHot
                  ? t.bar.hot
                  : t.bar.underpriced
                      .replace("{count}", String(underpricedReportCount))
                      .replace("{threshold}", String(threshold))}
              </p>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className={`h-full rounded-full transition-all ${
                  badge === "hot"
                    ? "bg-red-500"
                    : badge === "warning"
                      ? "bg-amber-500"
                      : "bg-zinc-300"
                }`}
                style={{ width: `${barPercent}%` }}
              />
            </div>

            {reportCount > 0 && (
              <p className="mt-2 text-xs text-zinc-600">
                {t.bar.totalReports.replace("{count}", String(reportCount))}
              </p>
            )}
          </div>

          {canReport ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={alreadyReported}
              title={alreadyReported ? t.alreadyReported : t.reportProject}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                alreadyReported
                  ? "cursor-not-allowed border-zinc-200 bg-white text-zinc-400"
                  : "border-red-200 bg-white text-red-700 hover:bg-red-50"
              }`}
            >
              <FlagIcon className="h-3.5 w-3.5" />
              {alreadyReported ? t.alreadyReportedShort : t.reportShort}
            </button>
          ) : (
            <Link
              href={localizedPath(locale, `/login?callbackUrl=/projects/${projectSlug}`)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <FlagIcon className="h-3.5 w-3.5" />
              {t.loginToReport}
            </Link>
          )}
        </div>
      </div>

      <ReportDialog
        open={open}
        onClose={() => setOpen(false)}
        targetType="PROJECT"
        targetProjectId={projectId}
      />
    </>
  );
}

export function ProjectReportFlag({
  reportCount,
  underpricedReportCount,
  moderationHot,
}: {
  reportCount: number;
  underpricedReportCount: number;
  moderationHot: boolean;
}) {
  const badge = getProjectReportBadge(
    reportCount,
    underpricedReportCount,
    moderationHot,
  );

  if (badge === "none") return null;

  const dict = useDictionary();
  const title =
    badge === "hot"
      ? dict.reports.flag.hot
      : dict.reports.flag.warning;

  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full px-2 py-0.5 ${
        badge === "hot"
          ? "bg-red-100 text-red-700"
          : "bg-amber-100 text-amber-800"
      }`}
      aria-label={title}
    >
      <FlagIcon className="h-3.5 w-3.5" />
    </span>
  );
}
