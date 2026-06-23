"use client";

import {
  adminApproveVerification,
  adminRejectVerification,
  type VerificationActionState,
} from "@/lib/actions/admin-verification";
import type { AdminVerificationItem } from "@/lib/queries/admin-verification";
import Link from "next/link";
import { useActionState } from "react";

const initialState: VerificationActionState = {};

function RejectForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(
    adminRejectVerification,
    initialState,
  );

  return (
    <form action={formAction} className="mt-2 space-y-2">
      <input type="hidden" name="userId" value={userId} />
      <textarea
        name="note"
        rows={2}
        placeholder="Причина отклонения (видна пользователю)"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "…" : "Отклонить"}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

function ApproveButton({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(
    adminApproveVerification,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? "…" : "Верифицировать"}
      </button>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      {state.success && (
        <p className="mt-1 text-xs text-green-700">Профиль верифицирован</p>
      )}
    </form>
  );
}

type AdminVerificationPanelProps = {
  items: AdminVerificationItem[];
  compact?: boolean;
};

export function AdminVerificationPanel({
  items,
  compact = false,
}: AdminVerificationPanelProps) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Верификация профилей
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Заявки фрилансеров на подтверждение профиля
          </p>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-800">
            {items.length} в очереди
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">Нет заявок на рассмотрении</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100">
          {items.map((item) => (
            <li key={item.userId} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/freelancers/${item.userId}`}
                    className="font-medium text-zinc-900 hover:text-indigo-600"
                    target="_blank"
                  >
                    {item.name ?? "Без имени"}
                  </Link>
                  <p className="text-xs text-zinc-500">{item.email}</p>
                  {item.title && (
                    <p className="mt-1 text-sm text-zinc-600">{item.title}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>★ {item.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>{item.completedProjects} проектов</span>
                    <span>·</span>
                    <span>{item.skillCount} навыков</span>
                    {item.verificationRequestedAt && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(item.verificationRequestedAt).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ApproveButton userId={item.userId} />
              </div>
              <RejectForm userId={item.userId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
