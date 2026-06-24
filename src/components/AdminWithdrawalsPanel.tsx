"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminApproveWithdrawal,
  adminRejectWithdrawal,
  type FinanceOpsState,
} from "@/lib/actions/admin-finance-ops";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminWithdrawalItem } from "@/lib/queries/admin-withdrawals";
import { formatUah } from "@/lib/freelancer-finances-shared";
import type { AppLocale } from "@/lib/i18n/types";
import { maskPayoutDestination } from "@/lib/withdrawals-shared";
import { useActionState } from "react";

const initialState: FinanceOpsState = {};

function ApproveButton({
  paymentId,
  locale,
}: {
  paymentId: string;
  locale: AppLocale;
}) {
  const w = getAdminCopy(locale).panels.withdrawals;
  const [state, formAction, pending] = useActionState(
    adminApproveWithdrawal,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="paymentId" value={paymentId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? "…" : w.approve}
      </button>
      <AdminActionError error={state.error} locale={locale} className="mt-1 text-xs text-red-600" />
      {state.success && (
        <p className="mt-1 text-xs text-green-700">{w.approved}</p>
      )}
    </form>
  );
}

function RejectForm({
  paymentId,
  locale,
}: {
  paymentId: string;
  locale: AppLocale;
}) {
  const w = getAdminCopy(locale).panels.withdrawals;
  const [state, formAction, pending] = useActionState(
    adminRejectWithdrawal,
    initialState,
  );

  return (
    <form action={formAction} className="mt-2 space-y-2">
      <input type="hidden" name="paymentId" value={paymentId} />
      <textarea
        name="reason"
        rows={2}
        placeholder={w.rejectReason}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "…" : w.rejectAndRefund}
      </button>
      <AdminActionError error={state.error} locale={locale} className="text-xs text-red-600" />
    </form>
  );
}

type AdminWithdrawalsPanelProps = {
  withdrawals: AdminWithdrawalItem[];
  locale: AppLocale;
  compact?: boolean;
};

export function AdminWithdrawalsPanel({
  withdrawals,
  locale,
  compact = false,
}: AdminWithdrawalsPanelProps) {
  const w = getAdminCopy(locale).panels.withdrawals;
  const totalPending = withdrawals.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{w.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{w.description}</p>
        </div>
        {withdrawals.length > 0 && (
          <div className="text-right">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              {withdrawals.length} {w.inQueue}
            </span>
            <p className="mt-1 text-xs text-zinc-500">
              {w.totalAmount} {formatUah(totalPending)}
            </p>
          </div>
        )}
      </div>

      {withdrawals.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{w.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100">
          {withdrawals.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">
                    {item.user.name ?? item.user.email}
                  </p>
                  <p className="text-xs text-zinc-500">{item.user.email}</p>
                  <p className="mt-2 text-lg font-bold text-zinc-900">
                    {formatUah(Number(item.amount))}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-zinc-600">
                    <p>
                      {item.method}:{" "}
                      <span className="font-mono">{maskPayoutDestination(item.destination)}</span>
                    </p>
                    <p>
                      {w.balance}: {formatUah(Number(item.user.balance))} ·{" "}
                      {new Date(item.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
                <ApproveButton paymentId={item.id} locale={locale} />
              </div>
              <RejectForm paymentId={item.id} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
