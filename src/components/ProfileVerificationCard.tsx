"use client";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  requestProfileVerification,
  type VerificationRequestState,
} from "@/lib/actions/freelancer-verification";
import {
  useDictionary,
  useDictionaryLocale,
} from "@/lib/i18n/dictionary-context";
import type { ProfileVerificationStatus } from "@/lib/freelancer-profile-shared";
import { useActionState } from "react";

const initialState: VerificationRequestState = {};

const STATUS_COLORS: Record<ProfileVerificationStatus, string> = {
  NONE: "bg-zinc-100 text-zinc-700",
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-sky-100 text-sky-800",
  REJECTED: "bg-red-100 text-red-800",
};

type ProfileVerificationCardProps = {
  status: ProfileVerificationStatus;
  verificationNote: string | null;
  verificationRequestedAt: string | null;
};

export function ProfileVerificationCard({
  status,
  verificationNote,
  verificationRequestedAt,
}: ProfileVerificationCardProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const v = dict.profileVerification;
  const [state, formAction, pending] = useActionState(
    requestProfileVerification,
    initialState,
  );

  const canRequest = status === "NONE" || status === "REJECTED";

  return (
    <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900">{v.title}</h2>
            {status === "APPROVED" && (
              <VerifiedBadge title={v.verifiedBadgeTitle} />
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-500">{v.description}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[status]}`}
        >
          {v.statuses[status]}
        </span>
      </div>

      {status === "REJECTED" && verificationNote && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {verificationNote}
        </p>
      )}

      {status === "PENDING" && verificationRequestedAt && (
        <p className="mt-3 text-sm text-zinc-600">
          {v.pendingSubmitted.replace(
            "{date}",
            new Date(verificationRequestedAt).toLocaleDateString(locale),
          )}
        </p>
      )}

      {status === "APPROVED" && (
        <p className="mt-3 text-sm text-sky-800">{v.approvedBody}</p>
      )}

      {canRequest && (
        <form action={formAction} className="mt-4">
          <p className="mb-3 text-xs text-zinc-500">{v.requirementsHint}</p>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {pending ? v.submitting : v.submit}
          </button>
          {state.error && (
            <p className="mt-2 text-sm text-red-600">{state.error}</p>
          )}
          {state.success && (
            <p className="mt-2 text-sm text-green-700">{v.successMessage}</p>
          )}
        </form>
      )}
    </section>
  );
}
