"use client";

import { FormActionError } from "@/components/FormActionError";
import {
  fundContestPrize,
  selectContestWinner,
  submitContestEntry,
  type ContestActionState,
} from "@/lib/actions/contests";
import { formatMoney } from "@/lib/i18n/currencies";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { useActionState } from "react";

type ContestEntryItem = {
  id: string;
  title: string | null;
  description: string | null;
  status: string;
  submittedAt: Date | null;
  freelancer: { id: string; name: string | null };
  files: { id: string; filename: string; url: string; mimeType: string | null }[];
};

type ContestPanelProps = {
  projectId: string;
  projectSlug: string;
  currency: string;
  prizeAmount: number;
  prizeFunded: boolean;
  submissionDeadline: Date | null;
  isClient: boolean;
  isFreelancer: boolean;
  entries: ContestEntryItem[];
  winnerSelected: boolean;
  clientBalance: number;
};

const initialState: ContestActionState = {};

export function ContestPanel({
  projectId,
  currency,
  prizeAmount,
  prizeFunded,
  submissionDeadline,
  isClient,
  isFreelancer,
  entries,
  winnerSelected,
  clientBalance,
}: ContestPanelProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const c = dict.contests;
  const [fundState, fundAction, fundPending] = useActionState(
    fundContestPrize,
    initialState,
  );
  const [entryState, entryAction, entryPending] = useActionState(
    submitContestEntry,
    initialState,
  );
  const [winnerState, winnerAction, winnerPending] = useActionState(
    selectContestWinner,
    initialState,
  );

  const submissionsOpen =
    !winnerSelected &&
    prizeFunded &&
    (!submissionDeadline || submissionDeadline > new Date());

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
        <h3 className="text-base font-semibold text-violet-950">{c.panelTitle}</h3>
        <p className="mt-1 text-sm text-violet-900/80">
          {c.prizeLabel}: {formatMoney(prizeAmount, currency, locale)}
        </p>
        {submissionDeadline && (
          <p className="mt-1 text-sm text-violet-900/70">
            {c.deadlineLabel}:{" "}
            {submissionDeadline.toLocaleDateString(locale, {
              dateStyle: "medium",
            })}
          </p>
        )}
        {isClient && !prizeFunded && !winnerSelected && (
          <form action={fundAction} className="mt-4">
            <input type="hidden" name="projectId" value={projectId} />
            <p className="mb-2 text-xs text-violet-900/70">
              {c.fundHint.replace(
                "{balance}",
                formatMoney(clientBalance, currency, locale),
              )}
            </p>
            <FormActionError error={fundState.error} />
            {fundState.success ? (
              <p className="text-sm font-medium text-green-700">{c.fundSuccess}</p>
            ) : (
              <button
                type="submit"
                disabled={fundPending}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {fundPending ? c.funding : c.fundPrize}
              </button>
            )}
          </form>
        )}
        {prizeFunded && !winnerSelected && (
          <p className="mt-2 text-sm font-medium text-green-700">{c.prizeFunded}</p>
        )}
      </div>

      {isFreelancer && submissionsOpen && (
        <form action={entryAction} className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="font-semibold text-zinc-900">{c.submitTitle}</h4>
          <input
            name="title"
            placeholder={c.entryTitlePlaceholder}
            className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            rows={4}
            placeholder={c.entryDescriptionPlaceholder}
            className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <input type="hidden" name="projectId" value={projectId} />
          <label className="mt-3 block text-sm text-zinc-600">
            {c.filesLabel}
            <input
              type="file"
              name="files"
              multiple
              accept="image/*,.pdf,.zip,.doc,.docx,.txt"
              className="mt-1 block w-full text-sm"
            />
          </label>
          <FormActionError error={entryState.error} className="mt-2" />
          {entryState.success ? (
            <p className="mt-2 text-sm text-green-700">{c.submitSuccess}</p>
          ) : (
            <button
              type="submit"
              disabled={entryPending}
              className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {entryPending ? c.submitting : c.submitEntry}
            </button>
          )}
        </form>
      )}

      {entries.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 className="font-semibold text-zinc-900">{c.entriesTitle}</h4>
          <ul className="mt-3 space-y-4">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-zinc-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">
                      {entry.title || entry.freelancer.name || c.anonymousEntry}
                    </p>
                    {entry.description && (
                      <p className="mt-1 text-sm text-zinc-600">{entry.description}</p>
                    )}
                    <p className="mt-1 text-xs text-zinc-500">
                      {entry.freelancer.name} ·{" "}
                      {entry.status === "WINNER" ? c.winnerBadge : c.submittedBadge}
                    </p>
                  </div>
                  {isClient && entry.status === "SUBMITTED" && !winnerSelected && (
                    <form action={winnerAction}>
                      <input type="hidden" name="projectId" value={projectId} />
                      <input type="hidden" name="entryId" value={entry.id} />
                      <button
                        type="submit"
                        disabled={winnerPending}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                      >
                        {winnerPending ? c.selecting : c.selectWinner}
                      </button>
                    </form>
                  )}
                </div>
                {entry.files.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {entry.files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={`/api/blob?url=${encodeURIComponent(file.url)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-sky-700 hover:underline"
                        >
                          {file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <FormActionError error={winnerState.error} className="mt-2" />
          {winnerState.success && (
            <p className="mt-2 text-sm text-green-700">{c.winnerSelected}</p>
          )}
        </div>
      )}
    </section>
  );
}
