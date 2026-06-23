"use client";

import type {
  AdminFinanceOverview,
  AdminPaymentItem,
} from "@/lib/queries/admin-finance";
import { contractStatusLabels, contractStatusColors } from "@/lib/contract-labels";
import { formatBudget } from "@/lib/project-labels";
import { formatUah } from "@/lib/freelancer-finances-shared";
import type { ContractStatus, PaymentStatus, PaymentType } from "@/generated/prisma/client";

const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  BALANCE_TOPUP: "Пополнение",
  SUBSCRIPTION: "Подписка",
  FEATURE_PROJECT: "Продвижение проекта",
  FEATURE_PROFILE: "Продвижение профиля",
  COMMISSION: "Комиссия",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Ожидает",
  COMPLETED: "Завершён",
  FAILED: "Ошибка",
  REFUNDED: "Возврат",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

function PaymentRow({ payment }: { payment: AdminPaymentItem }) {
  return (
    <tr>
      <td className="py-3 pr-4">
        <p className="font-medium text-zinc-900">
          {payment.user.name ?? payment.user.email}
        </p>
        <p className="text-xs text-zinc-500">{payment.user.email}</p>
      </td>
      <td className="py-3 pr-4 text-zinc-700">
        {PAYMENT_TYPE_LABELS[payment.type]}
      </td>
      <td className="py-3 pr-4 font-medium text-zinc-900">
        {formatBudget(payment.amount, payment.currency)}
      </td>
      <td className="py-3 pr-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[payment.status]}`}
        >
          {PAYMENT_STATUS_LABELS[payment.status]}
        </span>
      </td>
      <td className="py-3 text-xs text-zinc-500">
        {new Date(payment.createdAt).toLocaleString("ru-RU")}
      </td>
    </tr>
  );
}

type AdminFinancePanelProps = {
  finance: AdminFinanceOverview;
};

export function AdminFinancePanel({ finance }: AdminFinancePanelProps) {
  const { stats, recentPayments, activeContracts } = finance;

  const statCards = [
    {
      label: "Балансы пользователей",
      value: formatUah(stats.totalUserBalances),
      hint: "Сумма на счетах",
    },
    {
      label: "В эскроу",
      value: formatUah(stats.escrowAmount),
      hint: `${stats.escrowCount} активных сделок`,
    },
    {
      label: "Комиссия платформы",
      value: formatUah(stats.totalCommissions),
      hint: `Оборот: ${formatUah(stats.releasedAmount)}`,
    },
    {
      label: "Пополнения",
      value: formatUah(stats.totalTopups),
      hint: `${stats.completedPaymentsCount} платежей всего`,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Финансы</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Балансы, эскроу, комиссии и история платежей платформы.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4"
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

      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amber-900">
          Активные сделки ({activeContracts.length})
        </h3>
        {activeContracts.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Нет активного эскроу</p>
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
                      {formatUah(Number(contract.amount))} · комиссия{" "}
                      {formatUah(Number(contract.commission))}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Заказчик: {contract.client.name ?? contract.client.email}{" "}
                      · Исполнитель:{" "}
                      {contract.freelancer.name ?? contract.freelancer.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${contractStatusColors[contract.status as ContractStatus]}`}
                  >
                    {contractStatusLabels[contract.status as ContractStatus]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-900">
          Последние платежи ({recentPayments.length})
        </h3>
        {recentPayments.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Платежей пока нет</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs text-zinc-500">
                  <th className="pb-3 pr-4 font-medium">Пользователь</th>
                  <th className="pb-3 pr-4 font-medium">Тип</th>
                  <th className="pb-3 pr-4 font-medium">Сумма</th>
                  <th className="pb-3 pr-4 font-medium">Статус</th>
                  <th className="pb-3 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentPayments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
