"use client";

import { FormActionError } from "@/components/FormActionError";
import { openDispute, type ActionState } from "@/lib/actions/contracts";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";

const initialState: ActionState = {};

const MIN_REASON_LENGTH = 10;

type OpenDisputeButtonProps = {
  projectId: string;
  className?: string;
};

export function OpenDisputeButton({ projectId, className = "" }: OpenDisputeButtonProps) {
  const dict = useDictionary();
  const t = dict.inbox.dispute;
  const router = useRouter();
  const dialogTitleId = useId();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(openDispute, initialState);

  useEffect(() => {
    if (!state.success) return;
    setOpen(false);
    router.refresh();
  }, [state.success, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center justify-center rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
        }
      >
        {t.openButton}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={dialogTitleId} className="text-lg font-semibold text-zinc-900">
              {t.dialogTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{t.dialogBody}</p>

            <form action={formAction} className="mt-5 space-y-4">
              <input type="hidden" name="projectId" value={projectId} />

              <div>
                <label htmlFor={`${dialogTitleId}-reason`} className="block text-sm font-medium text-zinc-700">
                  {t.reasonLabel}
                </label>
                <textarea
                  id={`${dialogTitleId}-reason`}
                  name="reason"
                  required
                  minLength={MIN_REASON_LENGTH}
                  rows={4}
                  placeholder={t.reasonPlaceholder}
                  className="mt-1.5 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-red-300 focus:ring-2 focus:ring-red-500/15"
                />
                <p className="mt-1.5 text-xs text-zinc-500">{t.reasonHint}</p>
              </div>

              <FormActionError error={state.error} className="text-sm text-red-600" />

              {state.success ? (
                <p className="text-sm font-medium text-emerald-700">{t.success}</p>
              ) : (
                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {pending ? t.pending : t.submit}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
