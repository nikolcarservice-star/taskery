"use client";

import { FundContractForm } from "@/components/FundContractForm";
import { formatMoney, isSupportedCurrency, defaultCurrency } from "@/lib/i18n/currencies";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useAppLocale } from "@/lib/i18n/use-app-locale";
import type { ContractStatus, ProjectStatus } from "@/generated/prisma/client";

type EscrowFundingNoticeProps = {
  contractStatus: ContractStatus;
  projectStatus?: ProjectStatus;
  amount: number;
  currency: string;
  isClient: boolean;
  projectId?: string;
  clientBalance?: number;
  stripeEnabled?: boolean;
};

export function EscrowFundingNotice({
  contractStatus,
  projectStatus = "IN_PROGRESS",
  amount,
  currency,
  isClient,
  projectId,
  clientBalance = 0,
  stripeEnabled = false,
}: EscrowFundingNoticeProps) {
  const locale = useAppLocale();
  const dict = useDictionary();
  const n = dict.cabinetForms.escrowNotice;
  const projectCurrency = isSupportedCurrency(currency) ? currency : defaultCurrency;
  const formattedAmount = formatMoney(amount, projectCurrency, locale);

  if (
    contractStatus === "ESCROWED" &&
    projectStatus === "IN_PROGRESS" &&
    !isClient
  ) {
    return (
      <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-4 sm:px-6">
        <p className="text-sm font-medium text-emerald-900">
          {n.fundedFreelancerTitle.replace("{amount}", formattedAmount)}
        </p>
        <p className="mt-1 text-sm text-emerald-800">{n.fundedFreelancerBody}</p>
      </div>
    );
  }

  if (contractStatus !== "AWAITING_FUNDING") {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
      <p className="text-sm font-medium text-amber-900">
        {isClient ? n.awaitingClientTitle : n.awaitingFreelancerTitle}
      </p>
      <p className="mt-1 text-sm text-amber-800">
        {isClient
          ? n.awaitingClientBody.replace("{amount}", formattedAmount)
          : n.awaitingFreelancerBody}
      </p>

      {isClient && projectId && (
        <div className="mt-4">
          <FundContractForm
            projectId={projectId}
            amount={amount}
            currency={currency}
            clientBalance={clientBalance}
            stripeEnabled={stripeEnabled}
            compact
          />
        </div>
      )}
    </div>
  );
}
