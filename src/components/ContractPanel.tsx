"use client";

import { FormActionError } from "@/components/FormActionError";
import { OpenDisputeButton } from "@/components/OpenDisputeButton";
import {
  releaseContract,
  type ActionState,
} from "@/lib/actions/contracts";
import { FundContractForm } from "@/components/FundContractForm";
import { contractStatusColors } from "@/lib/contract-labels";
import { formatMoney } from "@/lib/i18n/currencies";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { ContractStatus, ProjectStatus } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type ContractPanelProps = {
  projectId: string;
  projectStatus: ProjectStatus;
  contract: {
    id: string;
    amount: { toString(): string };
    commission: { toString(): string };
    freelancerPayout: { toString(): string };
    status: ContractStatus;
    createdAt: Date;
    freelancer: { name: string | null };
  };
  currency: string;
  clientBalance: number;
  stripeEnabled: boolean;
};

const initialState: ActionState = {};

function ReleaseForm({ projectId }: { projectId: string }) {
  const dict = useDictionary();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    releaseContract,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="projectId" value={projectId} />
      <FormActionError error={state.error} className="mb-2 text-sm text-red-600" />
      {state.success ? (
        <p className="text-sm font-medium text-green-700">
          {dict.projectDetail.contractPanel.releaseSuccess}
        </p>
      ) : (
        <>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {pending
              ? dict.projectDetail.contractPanel.releasePending
              : dict.projectDetail.contractPanel.releaseSubmit}
          </button>
          <p className="mt-1 text-xs text-zinc-500">
            {dict.projectDetail.contractPanel.releaseHint}
          </p>
        </>
      )}
    </form>
  );
}

function DisputeForm({ projectId }: { projectId: string }) {
  return (
    <div className="mt-3">
      <OpenDisputeButton
        projectId={projectId}
        className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      />
    </div>
  );
}

export function ContractPanel({
  projectId,
  projectStatus,
  contract,
  currency,
  clientBalance,
  stripeEnabled,
}: ContractPanelProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const amount = Number(contract.amount);
  const commission = Number(contract.commission);
  const payout = Number(contract.freelancerPayout);
  const fmt = (value: number) => formatMoney(value, currency, locale);

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">{dict.projectDetail.contractPanel.title}</h2>

      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.freelancer}</dt>
          <dd className="font-medium text-zinc-900">
            {contract.freelancer.name ?? dict.projectDetail.common.freelancerFallback}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.dealAmount}</dt>
          <dd className="font-medium text-zinc-900">{fmt(amount)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.escrowStatus}</dt>
          <dd className="mt-1">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${contractStatusColors[contract.status]}`}
            >
              {dict.labels.contractStatus[contract.status]}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.projectStatus}</dt>
          <dd className="font-medium text-zinc-900">
            {dict.labels.projectStatus[projectStatus]}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.platformFee}</dt>
          <dd className="font-medium text-zinc-900">{fmt(commission)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.freelancerPayout}</dt>
          <dd className="font-medium text-zinc-900">{fmt(payout)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.clientBalance}</dt>
          <dd className="font-medium text-zinc-900">{fmt(clientBalance)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.dealCreatedAt}</dt>
          <dd className="font-medium text-zinc-900">
            {contract.createdAt.toLocaleDateString(locale)}
          </dd>
        </div>
      </dl>

      {projectStatus === "IN_PROGRESS" &&
        contract.status === "AWAITING_FUNDING" && (
          <FundContractForm
            projectId={projectId}
            amount={amount}
            currency={currency}
            clientBalance={clientBalance}
            stripeEnabled={stripeEnabled}
          />
        )}

      {projectStatus === "IN_PROGRESS" && contract.status === "ESCROWED" && (
        <div className="mt-6 border-t border-zinc-100 pt-6">
          <p className="text-sm text-zinc-600">
            {dict.projectDetail.contractPanel.escrowActionsHint}
          </p>
          <ReleaseForm projectId={projectId} />
          <DisputeForm projectId={projectId} />
        </div>
      )}

      {projectStatus === "UNDER_DISPUTE" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {dict.projectDetail.contractPanel.disputeOpenedNotice.replace("{amount}", fmt(amount))}
        </p>
      )}

      {projectStatus === "CLOSED" && contract.status === "RELEASED" && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          {dict.projectDetail.contractPanel.releasedNotice}
        </p>
      )}

      {projectStatus === "CLOSED" && contract.status === "REFUNDED" && (
        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {dict.projectDetail.contractPanel.refundedNotice}
        </p>
      )}
    </section>
  );
}

export function FreelancerContractPanel({
  projectId,
  projectStatus,
  contract,
  currency,
}: {
  projectId: string;
  projectStatus: ProjectStatus;
  contract: {
    amount: { toString(): string };
    status: ContractStatus;
    client: { name: string | null };
  };
  currency: string;
}) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const amount = Number(contract.amount);
  const formattedAmount = formatMoney(amount, currency, locale);

  return (
    <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <h2 className="text-lg font-semibold text-zinc-900">{dict.projectDetail.contractPanel.freelancerPanelTitle}</h2>
      <p className="mt-2 text-sm text-zinc-600">
        {dict.projectDetail.contractPanel.freelancerPanelClientPrefix}: {contract.client.name ?? dict.projectDetail.common.clientFallback} ·{" "}
        {dict.labels.projectStatus[projectStatus]}
      </p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.dealAmount}</dt>
          <dd className="font-medium text-zinc-900">{formattedAmount}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{dict.projectDetail.contractPanel.escrowStatus}</dt>
          <dd>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${contractStatusColors[contract.status]}`}
            >
              {dict.labels.contractStatus[contract.status]}
            </span>
          </dd>
        </div>
      </dl>
      {contract.status === "AWAITING_FUNDING" &&
        projectStatus === "IN_PROGRESS" && (
          <p className="mt-4 text-sm text-amber-800">
            {dict.projectDetail.contractPanel.awaitingFundingNotice}
          </p>
        )}
      {contract.status === "ESCROWED" && projectStatus === "IN_PROGRESS" && (
        <>
          <p className="mt-4 text-sm text-emerald-800">
            {dict.projectDetail.contractPanel.escrowedNotice}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {dict.projectDetail.contractPanel.escrowedHint}
          </p>
          <DisputeForm projectId={projectId} />
        </>
      )}
      {contract.status === "RELEASED" && (
        <p className="mt-4 text-sm text-green-700">
          {dict.projectDetail.contractPanel.paidNotice}
        </p>
      )}
      {projectStatus === "UNDER_DISPUTE" && (
        <p className="mt-4 text-sm text-red-700">
          {dict.projectDetail.contractPanel.disputeWaitNotice}
        </p>
      )}
    </section>
  );
}
