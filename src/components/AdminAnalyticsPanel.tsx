"use client";

import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
import { formatUah } from "@/lib/freelancer-finances-shared";
import type { AppLocale } from "@/lib/i18n/types";
import Link from "next/link";

type AdminAnalyticsPanelProps = {
  analytics: AdminAnalyticsOverview;
  locale: AppLocale;
  mobile?: boolean;
};

const RANGE_OPTIONS = [7, 30, 90] as const;

function DailyBarChart({
  title,
  data,
  valueKey,
  formatValue,
  colorClass,
}: {
  title: string;
  data: Array<{ date: string; count?: number; amount?: number }>;
  valueKey: "count" | "amount";
  formatValue: (value: number) => string;
  colorClass: string;
}) {
  const values = data.map((item) => item[valueKey] ?? 0);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <div className="mt-4 flex h-40 items-end gap-1 border-b border-zinc-100 pb-2">
        {data.map((item) => {
          const value = item[valueKey] ?? 0;
          const height = value > 0 ? (value / maxValue) * 100 : 2;
          const label = item.date.slice(5);
          return (
            <div
              key={item.date}
              className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
            >
              <div className="relative flex h-32 w-full items-end justify-center">
                <div
                  className={`w-full max-w-3 rounded-t ${colorClass}`}
                  style={{ height: `${height}%`, minHeight: value > 0 ? "4px" : "1px" }}
                  title={`${item.date}: ${formatValue(value)}`}
                />
              </div>
              <span className="hidden text-[9px] text-zinc-400 lg:block">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminAnalyticsPanel({
  analytics,
  locale,
  mobile = false,
}: AdminAnalyticsPanelProps) {
  const a = getAdminCopy(locale).panels.analytics;
  const { days, kpis, dailySignups, dailyProjects, dailyGmv } = analytics;
  const periodLabel = `${days} ${a.periodDays}`;

  const kpiCards = [
    {
      label: `${a.newUsers} (${periodLabel})`,
      value: String(kpis.newUsersInPeriod),
    },
    {
      label: `${a.newProjects} (${periodLabel})`,
      value: String(kpis.newProjectsInPeriod),
    },
    {
      label: `${a.gmvReleased} (${periodLabel})`,
      value: formatUah(kpis.releasedGmvInPeriod),
    },
    {
      label: `${a.platformCommissions} (${periodLabel})`,
      value: formatUah(kpis.commissionsInPeriod),
    },
    {
      label: a.openDisputes,
      value: String(kpis.openDisputes),
      alert: kpis.openDisputes > 0,
    },
    {
      label: a.pendingReports,
      value: String(kpis.pendingReports),
      alert: kpis.pendingReports > 0,
    },
    {
      label: a.pendingWithdrawals,
      value: `${kpis.pendingWithdrawals} · ${formatUah(kpis.pendingWithdrawalsAmount)}`,
      alert: kpis.pendingWithdrawals > 0,
    },
    {
      label: a.activeEscrow,
      value: `${kpis.activeEscrowCount} · ${formatUah(kpis.activeEscrowAmount)}`,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{a.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{a.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 shadow-sm">
            {RANGE_OPTIONS.map((option) => (
              <Link
                key={option}
                href={option === 30 ? "/admin" : `/admin?days=${option}`}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  days === option
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {option}
                {a.daysShort}
              </Link>
            ))}
          </div>
          {!mobile && (
            <a
              href="/api/admin/export/finance"
              className="inline-flex rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              {a.exportCsv}
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-4 shadow-sm ${
              card.alert
                ? "border-amber-200 bg-amber-50"
                : "border-zinc-200 bg-white"
            }`}
          >
            <p className="text-xs text-zinc-500">{card.label}</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DailyBarChart
          title={a.chartSignups}
          data={dailySignups}
          valueKey="count"
          formatValue={(value) => String(value)}
          colorClass="bg-indigo-500/90 group-hover:bg-indigo-600"
        />
        <DailyBarChart
          title={a.chartProjects}
          data={dailyProjects}
          valueKey="count"
          formatValue={(value) => String(value)}
          colorClass="bg-sky-500/90 group-hover:bg-sky-600"
        />
        <DailyBarChart
          title={a.chartGmv}
          data={dailyGmv}
          valueKey="amount"
          formatValue={formatUah}
          colorClass="bg-emerald-500/90 group-hover:bg-emerald-600"
        />
      </div>
    </section>
  );
}
