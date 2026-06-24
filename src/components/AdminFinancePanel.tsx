"use client";

import { AdminBalanceAdjustForm } from "@/components/AdminBalanceAdjustForm";

import type {
  AdminFinanceOverview,
  AdminPaymentItem,
} from "@/lib/queries/admin-finance";
import { contractStatusColors } from "@/lib/contract-labels";
import { getAdminCopy } from "@/lib/admin-i18n";
import { formatBudget } from "@/lib/project-labels";
import { formatUah } from "@/lib/freelancer-finances-shared";
import type { AppLocale } from "@/lib/i18n/types";
import type { ContractStatus, PaymentStatus, PaymentType } from "@/generated/prisma/client";

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

function PaymentRow({
  payment,
  locale,
}: {
  payment: AdminPaymentItem;
  locale: AppLocale;
}) {
  const f = getAdminCopy(locale).panels.finance;

  return (
    <tr>
      <td className="py-3 pr-4">
        <p className="font-medium text-zinc-900">
          {payment.user.name ?? payment.user.email}
        </p>
        <p className="text-xs text-zinc-500">{payment.user.email}</p>
      </td>
      <td className="py-3 pr-4 text-zinc-700">
        {f.paymentTypes[payment.type] ?? payment.type}
      </td>
      <td className="py-3 pr-4 font-medium text-zinc-900">
        {formatBudget(payment.amount, payment.currency)}
      </td>
      <td className="py-3 pr-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[payment.status]}`}
        >
          {f.paymentStatuses[payment.status] ?? payment.status}
        </span>
      </td>
      <td className="py-3 text-xs text-zinc-500">
        {new Date(payment.createdAt).toLocaleString(locale)}
      </td>
    </tr>
  );
}

type AdminFinancePanelProps = {
  finance: AdminFinanceOverview;
  locale: AppLocale;
  mobile?: boolean;
};

export function AdminFinancePanel({
  finance,
  locale,
  mobile = false,
}: AdminFinancePanelProps) {
  const f = getAdminCopy(locale).panels.finance;
  const { stats, recentPayments, activeContracts } = finance;

  const statCards = [
    {
      label: f.statUserBalances,
      value: formatUah(stats.totalUserBalances),
      hint: f.statUserBalancesHint,
    },
    {
      label: f.statEscrow,
      value: formatUah(stats.escrowAmount),
      hint: `${stats.escrowCount} ${f.activeDeals}`,
    },
    {
      label: f.statCommissions,
      value: formatUah(stats.totalCommissions),
      hint: `${f.turnover}: ${formatUah(stats.releasedAmount)}`,
    },
    {
      label: f.statTopups,
      value: formatUah(stats.totalTopups),
      hint: `${stats.completedPaymentsCount} ${f.paymentsTotal}`,
    },
  ];

  return (
    <div className={mobile ? "space-y-4" : "space-y-10"}>
      {!mobile && <AdminBalanceAdjustForm locale={locale} />}
      <section className={mobile ? "space-y-4" : "space-y-6"}>
      <div
        className={
          mobile
            ? "grid grid-cols-2 gap-3"
            : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        }
      >
        {!mobile && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">{f.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{f.description}</p>
          </>
        )}

        <div
          className={
            mobile
              ? "contents"
              : "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              className={
                mobile
                  ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                  : "rounded-xl border border-zinc-200 bg-zinc-50/50 p-4"
              }
            >
              <p className="text-xs text-zinc-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{card.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          mobile
            ? "rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
            : "rounded-2xl border border-amber-200 bg-white p-6 shadow-sm"
        }
      >
        <h3 className="text-base font-semibold text-amber-900">
          {f.activeContractsTitle} ({activeContracts.length})
        </h3>
        {activeContracts.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">{f.noActiveEscrow}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activeContracts.map((contract) => (
              <li
                key={contract.id}
                className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <a
                      href={`/projects/${contract.project.slug}`}
                      className="font-medium text-zinc-900 hover:text-blue-600"
                    >
                      {contract.project.title}
                    </a>
                    <p className="mt-1 text-zinc-600">
                      {formatUah(Number(contract.amount))} · {f.commission}{" "}
                      {formatUah(Number(contract.commission))}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {f.clientLabel}: {contract.client.name ?? contract.client.email}{" "}
                      · {f.freelancerLabel}:{" "}
                      {contract.freelancer.name ?? contract.freelancer.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${contractStatusColors[contract.status as ContractStatus]}`}
                  >
                    {f.contractStatuses[contract.status] ?? contract.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className={
          mobile
            ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        }
      >
        <h3 className="text-base font-semibold text-zinc-900">
          {f.recentPaymentsTitle} ({recentPayments.length})
        </h3>
        {recentPayments.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">{f.noPayments}</p>
        ) : mobile ? (
          <ul className="mt-4 space-y-3">
            {recentPayments.map((payment) => (
              <li
                key={payment.id}
                className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900">
                      {payment.user.name ?? payment.user.email}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {f.paymentTypes[payment.type as PaymentType] ?? payment.type}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-zinc-900">
                    {formatBudget(payment.amount, payment.currency)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[payment.status]}`}
                  >
                    {f.paymentStatuses[payment.status] ?? payment.status}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(payment.createdAt).toLocaleString(locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs text-zinc-500">
                  <th className="pb-3 pr-4 font-medium">{f.colUser}</th>
                  <th className="pb-3 pr-4 font-medium">{f.colType}</th>
                  <th className="pb-3 pr-4 font-medium">{f.colAmount}</th>
                  <th className="pb-3 pr-4 font-medium">{f.colStatus}</th>
                  <th className="pb-3 font-medium">{f.colDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentPayments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} locale={locale} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
