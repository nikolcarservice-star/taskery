"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminAdjustBalance,
  type FinanceOpsState,
} from "@/lib/actions/admin-finance-ops";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: FinanceOpsState = {};

type AdminBalanceAdjustFormProps = {
  locale: AppLocale;
};

export function AdminBalanceAdjustForm({ locale }: AdminBalanceAdjustFormProps) {
  const b = getAdminCopy(locale).panels.finance.balanceAdjust;
  const [state, formAction, pending] = useActionState(
    adminAdjustBalance,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-900">{b.title}</h2>
      <p className="mt-1 text-sm text-zinc-600">{b.description}</p>

      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">{b.userIdLabel}</span>
          <input
            name="userId"
            required
            placeholder={b.userIdPlaceholder}
            className="mt-1 w-full min-w-[200px] rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-56"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">{b.amountLabel}</span>
          <input
            name="amount"
            type="number"
            step={0.01}
            required
            placeholder={b.amountPlaceholder}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-36"
          />
        </label>
        <label className="block flex-1 text-sm">
          <span className="font-medium text-zinc-700">{b.reasonLabel}</span>
          <input
            name="reason"
            required
            placeholder={b.reasonPlaceholder}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? b.applying : b.apply}
        </button>
      </form>

      <AdminActionError error={state.error} locale={locale} className="mt-3 text-sm text-red-600" />
      {state.success && (
        <p className="mt-3 text-sm text-green-700">{b.success}</p>
      )}
    </section>
  );
}
