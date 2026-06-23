"use client";

import {
  getFreelancerClientWarnings,
  type ClientOrderStats,
} from "@/lib/client-stats-shared";
import { useDictionary } from "@/lib/i18n/dictionary-context";

type ClientOrderStatsPanelProps = {
  stats: ClientOrderStats;
};

export function ClientOrderStatsPanel({ stats }: ClientOrderStatsPanelProps) {
  const dict = useDictionary();
  const warnings = getFreelancerClientWarnings(stats);
  const totalKnown = stats.completedProjects + stats.uncompletedProjects;

  return (
    <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {dict.projectDetail.clientStats.title}
      </h3>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-emerald-50 px-3 py-2">
          <dt className="text-xs text-emerald-700">{dict.projectDetail.clientStats.completed}</dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums text-emerald-800">
            {stats.completedProjects}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2">
          <dt className="text-xs text-zinc-600">{dict.projectDetail.clientStats.uncompleted}</dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums text-zinc-800">
            {stats.uncompletedProjects}
          </dd>
        </div>
      </dl>

      {totalKnown === 0 && (
        <p className="text-xs leading-5 text-zinc-500">
          {dict.projectDetail.clientStats.noHistory}
        </p>
      )}

      {stats.reviewsReceived > 0 && (
        <p className="text-xs text-zinc-600">
          {dict.projectDetail.clientStats.reviewsCount.replace("{count}", String(stats.reviewsReceived))}
        </p>
      )}

      {warnings.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5"
        >
          <p className="text-xs font-semibold text-amber-900">
            {dict.projectDetail.clientStats.warningsTitle}
          </p>
          <ul className="mt-1.5 space-y-1 text-xs leading-5 text-amber-800">
            {warnings.map((warning) => (
              <li key={warning}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
