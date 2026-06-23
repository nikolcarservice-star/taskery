"use client";

import {
  adminAdjustBalance,
  type FinanceOpsState,
} from "@/lib/actions/admin-finance-ops";
import { useActionState } from "react";

const initialState: FinanceOpsState = {};

export function AdminBalanceAdjustForm() {
  const [state, formAction, pending] = useActionState(
    adminAdjustBalance,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-900">
        Корректировка баланса
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Пополнение (+) или списание (−) баланса пользователя. Действие записывается в журнал.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">ID пользователя</span>
          <input
            name="userId"
            required
            placeholder="cuid…"
            className="mt-1 w-full min-w-[200px] rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-56"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">Сумма (₴)</span>
          <input
            name="amount"
            type="number"
            step={0.01}
            required
            placeholder="+500 или -100"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-36"
          />
        </label>
        <label className="block flex-1 text-sm">
          <span className="font-medium text-zinc-700">Причина</span>
          <input
            name="reason"
            required
            placeholder="Компенсация / возврат"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Применяем…" : "Применить"}
        </button>
      </form>

      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mt-3 text-sm text-green-700">Баланс обновлён</p>
      )}
    </section>
  );
}
