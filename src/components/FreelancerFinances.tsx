"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import {
  formatFinanceDate,
  formatUah,
  type FinanceLedgerEntry,
  type FinanceSummary,
  type FinanceTab,
  type MonthlyStat,
} from "@/lib/freelancer-finances-shared";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type FreelancerFinancesProps = {
  summary: FinanceSummary;
  ledger: FinanceLedgerEntry[];
  monthlyStats: MonthlyStat[];
  yearTotal: number;
};

function SecurityBanner() {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.finances.freelancer;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      </span>
      <p>
        {t.securityBannerBefore}{" "}
        <Link href={l("/profile/edit")} className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
          {t.securityBannerLink}
        </Link>
        {t.securityBannerAfter}
      </p>
    </div>
  );
}

function BalanceTab({ summary }: { summary: FinanceSummary }) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.finances.freelancer;

  const cards = [
    {
      label: t.availableToWithdraw,
      value: formatUah(summary.availableBalance),
      hint: t.availableHint,
      accent: "text-zinc-900",
    },
    {
      label: t.escrow,
      value: formatUah(summary.escrowBalance),
      hint:
        summary.activeProjects > 0
          ? t.escrowHintActive.replace("{count}", String(summary.activeProjects))
          : t.escrowHintEmpty,
      accent: "text-indigo-600",
    },
    {
      label: t.totalEarned,
      value: formatUah(summary.totalEarned),
      hint: t.totalEarnedHint,
      accent: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <SecurityBanner />

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-zinc-500">{card.label}</p>
            <p className={`mt-3 text-3xl font-bold tracking-tight ${card.accent}`}>
              {card.value}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3.5 text-sm text-zinc-600">
        <p>{t.escrowInfo1}</p>
        <p className="mt-2">
          {t.escrowInfoBeforeLink}{" "}
          <Link href={l("/faq")} className="font-medium text-indigo-600 hover:underline">
            {t.escrowInfoLink}
          </Link>
          {t.escrowInfoAfterLink}
        </p>
      </div>
    </div>
  );
}

function LedgerAmount({ entry }: { entry: FinanceLedgerEntry }) {
  if (entry.direction === "hold") {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-zinc-500">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-xs">
          ◷
        </span>
        {formatUah(entry.amount)}
      </span>
    );
  }

  const isCredit = entry.direction === "credit";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tabular-nums ${
        isCredit ? "text-emerald-600" : "text-zinc-800"
      }`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
          isCredit ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-600"
        }`}
      >
        {isCredit ? "+" : "−"}
      </span>
      {isCredit ? "+" : "−"}
      {formatUah(entry.amount)}
    </span>
  );
}

function WithdrawalsTab({
  summary,
  ledger,
}: {
  summary: FinanceSummary;
  ledger: FinanceLedgerEntry[];
}) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const locale = useDictionaryLocale();
  const t = dict.cabinetForms.finances.freelancer;
  const common = dict.cabinetForms.common;

  return (
    <div className="space-y-6">
      <SecurityBanner />

      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">{t.availableToWithdraw}</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {formatUah(summary.availableBalance)}
          </p>
        </div>
        <button
          type="button"
          disabled
          title={common.soon}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          {t.requestWithdrawal}
        </button>
      </div>

      <p className="text-sm text-zinc-500">{t.withdrawalSoon}</p>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/90 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3.5">{t.colDate}</th>
                <th className="px-5 py-3.5">{t.colCredit}</th>
                <th className="px-5 py-3.5">{t.colDescription}</th>
                <th className="px-5 py-3.5 text-right">{t.colAmount}</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-zinc-500">
                    {t.emptyLedger}
                  </td>
                </tr>
              ) : (
                ledger.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-zinc-100 ${
                      index % 2 === 1 ? "bg-zinc-50/40" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-zinc-600">
                      {formatFinanceDate(entry.createdAt, locale)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-zinc-600">
                      {entry.settledAt
                        ? formatFinanceDate(entry.settledAt, locale)
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {entry.projectSlug ? (
                        <Link
                          href={l(`/projects/${entry.projectSlug}`)}
                          className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          {entry.title}
                        </Link>
                      ) : (
                        <span className="text-zinc-800">{entry.title}</span>
                      )}
                      {entry.direction === "hold" && (
                        <span className="mt-1 block text-xs text-zinc-500">
                          {t.awaitingCompletion}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <LedgerAmount entry={entry} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatisticsTab({
  monthlyStats,
  yearTotal,
}: {
  monthlyStats: MonthlyStat[];
  yearTotal: number;
}) {
  const dict = useDictionary();
  const t = dict.cabinetForms.finances.freelancer;
  const maxAmount = useMemo(
    () => Math.max(...monthlyStats.map((item) => item.amount), 1),
    [monthlyStats],
  );

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">
            {t.yearTotal.replace("{year}", String(currentYear))}
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {formatUah(yearTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">{t.activeMonths}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {monthlyStats.filter((item) => item.amount > 0).length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-zinc-900">
            {t.monthlyIncome}
          </h2>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              {t.projectsLegend}
            </span>
          </div>
        </div>

        <div className="flex h-56 items-end gap-2 border-b border-zinc-100 pb-2">
          {monthlyStats.map((item) => {
            const height = item.amount > 0 ? (item.amount / maxAmount) * 100 : 4;
            return (
              <div
                key={item.monthKey}
                className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="relative flex h-40 w-full items-end justify-center">
                  <div
                    className="w-full max-w-8 rounded-t-md bg-indigo-500/90 transition-colors group-hover:bg-indigo-600"
                    style={{ height: `${height}%`, minHeight: item.amount > 0 ? "8px" : "2px" }}
                    title={`${item.label}: ${formatUah(item.amount)}`}
                  />
                </div>
                <span className="hidden text-[10px] text-zinc-400 sm:block">
                  {item.label.split(" ")[0].slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/90 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-5 py-3.5">{t.colPeriod}</th>
              <th className="px-5 py-3.5">{t.colProjects}</th>
              <th className="px-5 py-3.5 text-right">{t.colAmount}</th>
            </tr>
          </thead>
          <tbody>
            {[...monthlyStats].reverse().map((item, index) => (
              <tr
                key={item.monthKey}
                className={`border-b border-zinc-100 ${
                  index % 2 === 1 ? "bg-zinc-50/40" : "bg-white"
                }`}
              >
                <td className="px-5 py-3.5 font-medium text-zinc-800">
                  {item.label}
                </td>
                <td className="px-5 py-3.5 text-zinc-600">{item.projects}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-zinc-900">
                  {formatUah(item.amount)}
                </td>
              </tr>
            ))}
            <tr className="bg-emerald-50/60 font-semibold">
              <td className="px-5 py-3.5 text-zinc-900">
                {t.yearTotalRow.replace("{year}", String(currentYear))}
              </td>
              <td className="px-5 py-3.5 text-zinc-700">
                {monthlyStats.reduce((sum, item) => sum + item.projects, 0)}
              </td>
              <td className="px-5 py-3.5 text-right text-emerald-700">
                {formatUah(yearTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FreelancerFinances({
  summary,
  ledger,
  monthlyStats,
  yearTotal,
}: FreelancerFinancesProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabLabels = dict.cabinetForms.finances.freelancer.tabs;
  const tabs: { id: FinanceTab; label: string }[] = [
    { id: "balance", label: tabLabels.balance },
    { id: "withdrawals", label: tabLabels.withdrawals },
    { id: "statistics", label: tabLabels.statistics },
  ];
  const financesBase = l("/dashboard/finances");
  const tabParam = searchParams.get("tab");
  const activeTab: FinanceTab =
    tabParam === "withdrawals" || tabParam === "statistics"
      ? tabParam
      : "balance";

  function setTab(tab: FinanceTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "balance") params.delete("tab");
    else params.set("tab", tab);
    const query = params.toString();
    router.push(query ? `${financesBase}?${query}` : financesBase);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "balance" && <BalanceTab summary={summary} />}
        {activeTab === "withdrawals" && (
          <WithdrawalsTab summary={summary} ledger={ledger} />
        )}
        {activeTab === "statistics" && (
          <StatisticsTab monthlyStats={monthlyStats} yearTotal={yearTotal} />
        )}
      </div>
    </div>
  );
}
