"use client";

import { BalanceTopUp } from "@/components/BalanceTopUp";
import { useLocalizedPath } from "@/components/LocalizedLink";
import {
  formatFinanceDate,
  formatUah,
  type FinanceLedgerEntry,
  type FinanceSummary,
  type MonthlyStat,
} from "@/lib/freelancer-finances-shared";
import { getLedgerDirectionLabel } from "@/lib/i18n/cabinet-form-options";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

type ClientFinancesProps = {
  summary: FinanceSummary;
  ledger: FinanceLedgerEntry[];
  monthlyStats: MonthlyStat[];
  yearTotal: number;
  stripeEnabled: boolean;
};

function directionClass(direction: FinanceLedgerEntry["direction"]) {
  switch (direction) {
    case "credit":
      return "text-emerald-600";
    case "debit":
      return "text-zinc-900";
    case "hold":
      return "text-indigo-600";
  }
}

export function ClientFinances({
  summary,
  ledger,
  monthlyStats,
  yearTotal,
  stripeEnabled,
}: ClientFinancesProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.finances.client;

  const cards = [
    {
      label: t.balance,
      value: formatUah(summary.availableBalance),
      hint: t.balanceHint,
    },
    {
      label: t.escrow,
      value: formatUah(summary.escrowBalance),
      hint:
        summary.activeProjects > 0
          ? t.escrowHintActive.replace("{count}", String(summary.activeProjects))
          : t.escrowHintEmpty,
    },
    {
      label: t.totalSpent,
      value: formatUah(summary.totalEarned),
      hint: t.totalSpentHint,
    },
  ];

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-zinc-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              {card.value}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-4">
        <p className="text-sm font-medium text-zinc-900">{t.topUpTitle}</p>
        <p className="mt-1 text-sm text-zinc-600">{t.topUpDescription}</p>
        <div className="mt-3">
          <BalanceTopUp stripeEnabled={stripeEnabled} />
        </div>
      </div>

      <section>
        <h2 className="text-base font-semibold text-zinc-900">{t.historyTitle}</h2>
        {ledger.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">{t.emptyHistory}</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
            <ul className="divide-y divide-zinc-100">
              {ledger.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3.5 text-sm"
                >
                  <div className="min-w-0">
                    {entry.projectSlug ? (
                      <Link
                        href={l(`/projects/${entry.projectSlug}`)}
                        className="font-medium text-zinc-900 hover:text-indigo-600"
                      >
                        {entry.title}
                      </Link>
                    ) : (
                      <p className="font-medium text-zinc-900">{entry.title}</p>
                    )}
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {formatFinanceDate(entry.createdAt, locale)} ·{" "}
                      {getLedgerDirectionLabel(dict, entry.direction)}
                    </p>
                  </div>
                  <p className={`font-semibold ${directionClass(entry.direction)}`}>
                    {entry.direction === "credit" ? "+" : entry.direction === "debit" ? "−" : ""}
                    {formatUah(entry.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-zinc-900">
            {t.yearlyExpenses}
          </h2>
          <p className="text-sm font-semibold text-zinc-900">
            {formatUah(yearTotal)}
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {monthlyStats.slice(-6).map((stat) => (
            <div
              key={stat.monthKey}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm"
            >
              <p className="text-zinc-500">{stat.label}</p>
              <p className="mt-1 font-semibold text-zinc-900">
                {formatUah(stat.amount)}
              </p>
              <p className="text-xs text-zinc-500">
                {stat.projects}{" "}
                {stat.projects === 1 ? t.projectOne : t.projectMany}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
