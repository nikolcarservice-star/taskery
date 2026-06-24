"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminApproveVerification,
  adminRejectVerification,
  type VerificationActionState,
} from "@/lib/actions/admin-verification";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminVerificationItem } from "@/lib/queries/admin-verification";
import type { AppLocale } from "@/lib/i18n/types";
import Link from "next/link";
import { useActionState } from "react";

const initialState: VerificationActionState = {};

function RejectForm({
  userId,
  locale,
}: {
  userId: string;
  locale: AppLocale;
}) {
  const v = getAdminCopy(locale).panels.verification;
  const c = getAdminCopy(locale).panels.common;
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
        placeholder={v.rejectReason}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "…" : c.reject}
      </button>
      <AdminActionError error={state.error} locale={locale} className="text-xs text-red-600" />
    </form>
  );
}

function ApproveButton({
  userId,
  locale,
}: {
  userId: string;
  locale: AppLocale;
}) {
  const v = getAdminCopy(locale).panels.verification;
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
        {pending ? "…" : v.approve}
      </button>
      <AdminActionError error={state.error} locale={locale} className="mt-1 text-xs text-red-600" />
      {state.success && (
        <p className="mt-1 text-xs text-green-700">{v.approved}</p>
      )}
    </form>
  );
}

type AdminVerificationPanelProps = {
  items: AdminVerificationItem[];
  locale: AppLocale;
  compact?: boolean;
};

export function AdminVerificationPanel({
  items,
  locale,
  compact = false,
}: AdminVerificationPanelProps) {
  const v = getAdminCopy(locale).panels.verification;

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{v.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{v.subtitle}</p>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-800">
            {items.length} {v.inQueue}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{v.empty}</p>
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
                    {item.name ?? v.noName}
                  </Link>
                  <p className="text-xs text-zinc-500">{item.email}</p>
                  {item.title && (
                    <p className="mt-1 text-sm text-zinc-600">{item.title}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>★ {item.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>
                      {item.completedProjects} {v.projects}
                    </span>
                    <span>·</span>
                    <span>
                      {item.skillCount} {v.skills}
                    </span>
                    {item.verificationRequestedAt && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(item.verificationRequestedAt).toLocaleDateString(
                            locale,
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ApproveButton userId={item.userId} locale={locale} />
              </div>
              <RejectForm userId={item.userId} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
