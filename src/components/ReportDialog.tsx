"use client";

import { FormActionError } from "@/components/FormActionError";
import { submitReport, type ReportState } from "@/lib/actions/reports";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { ReportReason } from "@/generated/prisma/client";
import {
  PROJECT_REPORT_REASONS,
  USER_REPORT_REASONS,
} from "@/lib/reports-shared";
import { useActionState, useEffect, useRef } from "react";

type ReportDialogProps = {
  open: boolean;
  onClose: () => void;
  targetType: "PROJECT" | "USER";
  targetProjectId?: string;
  targetUserId?: string;
};

const initialState: ReportState = {};

export function ReportDialog({
  open,
  onClose,
  targetType,
  targetProjectId,
  targetUserId,
}: ReportDialogProps) {
  const dict = useDictionary();
  const t = dict.reports;
  const [state, formAction, pending] = useActionState(submitReport, initialState);
  const closeTimerRef = useRef<number | null>(null);

  const reasons =
    targetType === "PROJECT" ? PROJECT_REPORT_REASONS : USER_REPORT_REASONS;

  useEffect(() => {
    if (!state.success) return;

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, 1200);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [state.success, onClose]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="report-dialog-title" className="text-lg font-semibold text-zinc-900">
          {targetType === "PROJECT" ? t.reportProject : t.reportUser}
        </h2>
        <p className="mt-1 text-sm text-zinc-600">{t.dialogHint}</p>

        {state.success ? (
          <p className="mt-4 text-sm text-emerald-700" role="status">
            {t.success}
          </p>
        ) : (
          <form action={formAction} className="mt-4 space-y-4">
            <input type="hidden" name="targetType" value={targetType} />
            {targetProjectId && (
              <input type="hidden" name="targetProjectId" value={targetProjectId} />
            )}
            {targetUserId && (
              <input type="hidden" name="targetUserId" value={targetUserId} />
            )}

            <div>
              <label htmlFor="report-reason" className="block text-sm font-medium text-zinc-700">
                {t.reasonLabel}
              </label>
              <select
                id="report-reason"
                name="reason"
                required
                defaultValue={targetType === "PROJECT" ? "UNDERPRICED" : "HARASSMENT"}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              >
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {t.reasons[reason as ReportReason]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="report-details" className="block text-sm font-medium text-zinc-700">
                {t.detailsLabel}
              </label>
              <textarea
                id="report-details"
                name="details"
                rows={4}
                maxLength={2000}
                placeholder={t.detailsPlaceholder}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>

            <FormActionError error={state.error} />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                {dict.cabinetForms.common.cancel}
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {pending ? t.submitting : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
