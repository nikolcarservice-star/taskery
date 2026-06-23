"use client";

import {
  adminFineUser,
  adminIssueWarning,
  adminTempBanUser,
  type SanctionActionState,
} from "@/lib/actions/admin-sanctions";
import type { AdminUserItem } from "@/lib/queries/admin-users";
import { useActionState, useState } from "react";

const initialState: SanctionActionState = {};

type AdminUserSanctionsProps = {
  user: AdminUserItem;
};

export function AdminUserSanctions({ user }: AdminUserSanctionsProps) {
  const [open, setOpen] = useState(false);
  const [warnState, warnAction, warnPending] = useActionState(
    adminIssueWarning,
    initialState,
  );
  const [tempBanState, tempBanAction, tempBanPending] = useActionState(
    adminTempBanUser,
    initialState,
  );
  const [fineState, fineAction, finePending] = useActionState(
    adminFineUser,
    initialState,
  );

  if (user.deletedAt) return null;

  const error = warnState.error || tempBanState.error || fineState.error;
  const success =
    warnState.success || tempBanState.success || fineState.success;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-xs font-medium text-amber-700 hover:text-amber-900"
      >
        {open ? "Скрыть санкции" : "Санкции ▾"}
        {user._count.warningsReceived > 0 && (
          <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-900">
            {user._count.warningsReceived} предупр.
          </span>
        )}
      </button>

      {open && (
        <div className="mt-2 space-y-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
          <form action={warnAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <input
              name="reason"
              placeholder="Предупреждение"
              className="min-w-[120px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
            />
            <button
              type="submit"
              disabled={warnPending}
              className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              Предупредить
            </button>
          </form>

          <form action={tempBanAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <input
              name="days"
              type="number"
              min={1}
              max={365}
              defaultValue={7}
              className="w-16 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
              title="Дней"
            />
            <input
              name="reason"
              placeholder="Причина временного бана"
              className="min-w-[120px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
            />
            <button
              type="submit"
              disabled={tempBanPending}
              className="rounded-full bg-orange-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              Временный бан
            </button>
          </form>

          <form action={fineAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <input
              name="amount"
              type="number"
              min={1}
              step={1}
              placeholder="₴"
              className="w-20 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
            />
            <input
              name="reason"
              placeholder="Причина штрафа"
              className="min-w-[120px] flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs"
            />
            <button
              type="submit"
              disabled={finePending}
              className="rounded-full bg-red-700 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              Штраф
            </button>
          </form>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-green-700">Готово</p>}
        </div>
      )}
    </div>
  );
}
