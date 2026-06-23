"use client";

import { ReportDialog } from "@/components/ReportDialog";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { localizedPath } from "@/lib/i18n/routing";
import type { AppLocale } from "@/lib/i18n/types";
import {
  getOtherReportCount,
  getProjectReportDisplayMode,
  getProjectReportFlagKind,
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

function ReportActionButton({
  canReport,
  alreadyReported,
  locale,
  projectSlug,
  onOpen,
}: {
  canReport: boolean;
  alreadyReported: boolean;
  locale: AppLocale;
  projectSlug: string;
  onOpen: () => void;
}) {
  const dict = useDictionary();
  const t = dict.reports;

  if (canReport) {
    return (
      <button
        type="button"
        onClick={onOpen}
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
    );
  }

  return (
    <Link
      href={localizedPath(locale, `/login?callbackUrl=/projects/${projectSlug}`)}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
    >
      <FlagIcon className="h-3.5 w-3.5" />
      {t.loginToReport}
    </Link>
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
  const mode = getProjectReportDisplayMode(
    reportCount,
    underpricedReportCount,
    moderationHot,
  );
  const otherReportCount = getOtherReportCount(
    reportCount,
    underpricedReportCount,
  );

  if (isOwner) {
    if (mode === "none" && !hiddenFromCatalog) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {hiddenFromCatalog || moderationHot
          ? t.ownerHiddenNotice
          : mode === "underpriced"
            ? t.ownerUnderpricedNotice
                .replace("{count}", String(underpricedReportCount))
                .replace("{threshold}", String(threshold))
            : t.ownerReportsNotice.replace("{count}", String(otherReportCount))}
      </div>
    );
  }

  if (mode === "none") {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 sm:px-5">
          <p className="text-sm text-zinc-600">{t.emptyPrompt}</p>
          <ReportActionButton
            canReport={canReport}
            alreadyReported={alreadyReported}
            locale={locale}
            projectSlug={projectSlug}
            onOpen={() => setOpen(true)}
          />
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

  const isUnderpriced = mode === "underpriced";
  const barCount = isUnderpriced
    ? Math.min(underpricedReportCount, threshold)
    : 0;
  const barPercent =
    isUnderpriced && threshold > 0
      ? Math.round((barCount / threshold) * 100)
      : 0;
  const isHot = isUnderpriced && (moderationHot || underpricedReportCount >= threshold);

  const title = isUnderpriced
    ? moderationHot
      ? t.bar.hot
      : t.bar.underpriced
          .replace("{count}", String(underpricedReportCount))
          .replace("{threshold}", String(threshold))
    : t.bar.general.replace("{count}", String(otherReportCount));

  return (
    <>
      <div
        className={`rounded-2xl border px-4 py-3 sm:px-5 ${
          isHot
            ? "border-red-200 bg-red-50"
            : isUnderpriced
              ? "border-amber-200 bg-amber-50"
              : "border-orange-200 bg-orange-50"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FlagIcon
                className={`h-4 w-4 shrink-0 ${
                  isHot
                    ? "text-red-600"
                    : isUnderpriced
                      ? "text-amber-600"
                      : "text-orange-600"
                }`}
              />
              <p className="text-sm font-medium text-zinc-900">{title}</p>
            </div>

            {isUnderpriced && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full rounded-full transition-all ${
                    isHot ? "bg-red-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${barPercent}%` }}
                />
              </div>
            )}
          </div>

          <ReportActionButton
            canReport={canReport}
            alreadyReported={alreadyReported}
            locale={locale}
            projectSlug={projectSlug}
            onOpen={() => setOpen(true)}
          />
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
  const dict = useDictionary();
  const kind = getProjectReportFlagKind(
    reportCount,
    underpricedReportCount,
    moderationHot,
  );

  if (kind === "none") return null;

  const isUnderpriced = kind === "underpriced" || kind === "underpriced_hot";
  const title = isUnderpriced
    ? kind === "underpriced_hot"
      ? dict.reports.flag.underpricedHot
      : dict.reports.flag.underpriced
    : dict.reports.flag.general;

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        kind === "underpriced_hot"
          ? "bg-red-100 text-red-700"
          : isUnderpriced
            ? "bg-amber-100 text-amber-800"
            : "bg-orange-100 text-orange-800"
      }`}
      aria-label={title}
    >
      <FlagIcon className="h-3 w-3" />
      <span className="hidden sm:inline">{title}</span>
    </span>
  );
}
