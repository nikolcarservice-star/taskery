"use client";

import { FormActionError } from "@/components/FormActionError";
import {
  releaseMilestone,
  saveContractMilestones,
  type MilestoneActionState,
} from "@/lib/actions/milestones";
import { formatMoney } from "@/lib/i18n/currencies";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import type { ContractStatus, MilestoneStatus } from "@/generated/prisma/client";
import { useActionState } from "react";

type MilestoneRow = {
  id: string;
  title: string;
  amount: { toString(): string };
  status: MilestoneStatus;
  releasedAt: Date | null;
};

type ContractMilestonesPanelProps = {
  projectId: string;
  contractStatus: ContractStatus;
  currency: string;
  contractAmount: number;
  milestones: MilestoneRow[];
  isClient: boolean;
};

const initialState: MilestoneActionState = {};

export function ContractMilestonesPanel({
  projectId,
  contractStatus,
  currency,
  contractAmount,
  milestones,
  isClient,
}: ContractMilestonesPanelProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const m = dict.projectDetail.milestones;
  const [saveState, saveAction, savePending] = useActionState(
    saveContractMilestones,
    initialState,
  );
  const [releaseState, releaseAction, releasePending] = useActionState(
    releaseMilestone,
    initialState,
  );

  const canEdit =
    isClient && contractStatus === "AWAITING_FUNDING" && milestones.length === 0;
  const canRelease =
    isClient && contractStatus === "ESCROWED" && milestones.length > 0;

  return (
    <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">{m.title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{m.description}</p>

      {canEdit && (
        <form action={saveAction} className="mt-4 space-y-3">
          <input type="hidden" name="projectId" value={projectId} />
          {[0, 1, 2].map((index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_140px]">
              <input
                name="milestoneTitle"
                placeholder={m.milestoneTitlePlaceholder}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <input
                name="milestoneAmount"
                type="number"
                min={1}
                step="0.01"
                placeholder={m.amountPlaceholder}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <p className="text-xs text-zinc-500">
            {m.sumHint.replace(
              "{amount}",
              formatMoney(contractAmount, currency, locale),
            )}
          </p>
          <FormActionError error={saveState.error} />
          {saveState.success ? (
            <p className="text-sm text-green-700">{m.saved}</p>
          ) : (
            <button
              type="submit"
              disabled={savePending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {savePending ? m.saving : m.save}
            </button>
          )}
        </form>
      )}

      {milestones.length > 0 && (
        <ul className="mt-4 space-y-3">
          {milestones.map((milestone) => (
            <li
              key={milestone.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-zinc-900">{milestone.title}</p>
                <p className="text-sm text-zinc-600">
                  {formatMoney(Number(milestone.amount), currency, locale)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    milestone.status === "RELEASED"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {milestone.status === "RELEASED" ? m.statusReleased : m.statusPending}
                </span>
                {canRelease && milestone.status === "PENDING" && (
                  <form action={releaseAction}>
                    <input type="hidden" name="projectId" value={projectId} />
                    <input type="hidden" name="milestoneId" value={milestone.id} />
                    <button
                      type="submit"
                      disabled={releasePending}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {releasePending ? m.releasing : m.release}
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <FormActionError error={releaseState.error} className="mt-2" />
      {releaseState.success && (
        <p className="mt-2 text-sm text-green-700">{m.released}</p>
      )}
    </section>
  );
}
