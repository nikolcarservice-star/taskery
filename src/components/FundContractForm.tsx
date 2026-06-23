"use client";

import { BalanceTopUp } from "@/components/BalanceTopUp";
import { FormActionError } from "@/components/FormActionError";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { fundContract, type ActionState } from "@/lib/actions/contracts";
import {
  formatMoney,
  isSupportedCurrency,
  defaultCurrency,
  type SupportedCurrency,
} from "@/lib/i18n/currencies";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState: ActionState = {};

type FundContractFormProps = {
  projectId: string;
  amount: number;
  currency: string;
  clientBalance: number;
  stripeEnabled: boolean;
  compact?: boolean;
};

export function FundContractForm({
  projectId,
  amount,
  currency,
  clientBalance,
  stripeEnabled,
  compact = false,
}: FundContractFormProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const f = dict.cabinetForms.fundContract;
  const l = useLocalizedPath();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(fundContract, initialState);
  const hasEnoughBalance = clientBalance >= amount;
  const projectCurrency: SupportedCurrency = isSupportedCurrency(currency)
    ? currency
    : defaultCurrency;
  const formattedAmount = formatMoney(amount, projectCurrency, locale);
  const formattedBalance = formatMoney(clientBalance, projectCurrency, locale);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (state.success) {
    return <p className="text-sm font-medium text-green-700">{f.success}</p>;
  }

  return (
    <div className={compact ? "space-y-3" : "mt-6 space-y-4 border-t border-zinc-100 pt-6"}>
      {!compact && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">{f.title}</h3>
          <p className="mt-1 text-sm text-zinc-600">
            {f.description.replace("{amount}", formattedAmount)}
          </p>
        </div>
      )}

      <FormActionError error={state.error} className="text-sm text-red-600" />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600">
        <span>
          {f.yourBalance}{" "}
          <span className="font-medium text-zinc-900">{formattedBalance}</span>
        </span>
        <span>
          {f.toFund}{" "}
          <span className="font-medium text-zinc-900">{formattedAmount}</span>
        </span>
      </div>

      {hasEnoughBalance ? (
        <form action={formAction}>
          <input type="hidden" name="projectId" value={projectId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending
              ? f.processing
              : f.submit.replace("{amount}", formattedAmount)}
          </button>
        </form>
      ) : (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-sm text-amber-900">{f.insufficient}</p>
          {stripeEnabled ? (
            <StripeCheckoutButton
              type="fund_escrow"
              projectId={projectId}
              label={f.payStripe.replace("{amount}", formattedAmount)}
              variant="primary"
            />
          ) : null}
          <BalanceTopUp
            stripeEnabled={stripeEnabled}
            projectId={projectId}
            currency={projectCurrency}
            suggestedAmount={Math.max(amount - clientBalance, 100)}
          />
          <Link
            href={l("/client/finances")}
            className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {f.goFinances}
          </Link>
        </div>
      )}
    </div>
  );
}
