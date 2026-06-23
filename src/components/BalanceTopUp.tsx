"use client";

import { DemoTopUpButton } from "@/components/DemoTopUpButton";
import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { formatMoney, getTopUpLimits, type SupportedCurrency } from "@/lib/i18n/currencies";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useAppLocale } from "@/lib/i18n/use-app-locale";
import { useState } from "react";

type BalanceTopUpProps = {
  stripeEnabled: boolean;
  projectId?: string;
  currency?: SupportedCurrency;
  suggestedAmount?: number;
};

export function BalanceTopUp({
  stripeEnabled,
  projectId,
  currency = "UAH",
  suggestedAmount = 1000,
}: BalanceTopUpProps) {
  const locale = useAppLocale();
  const dict = useDictionary();
  const t = dict.cabinetForms.balanceTopUp;
  const limits = getTopUpLimits(currency);
  const [amount, setAmount] = useState(String(suggestedAmount));
  const formattedAmount = formatMoney(Number(amount) || limits.min, currency, locale);

  return (
    <div className="mt-3 space-y-3">
      {stripeEnabled ? (
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label
              htmlFor={projectId ? `topup-amount-${projectId}` : "topup-amount"}
              className="block text-xs font-medium text-zinc-500"
            >
              {t.amountLabel.replace("{currency}", currency)}
            </label>
            <input
              id={projectId ? `topup-amount-${projectId}` : "topup-amount"}
              type="number"
              min={limits.min}
              max={limits.max}
              step={currency === "EUR" ? 1 : 100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>
          <StripeCheckoutButton
            type="topup"
            amount={Number(amount)}
            projectId={projectId}
            label={t.topUp.replace("{amount}", formattedAmount)}
          />
        </div>
      ) : (
        <DemoTopUpButton />
      )}
      {!stripeEnabled && (
        <p className="text-xs text-zinc-500">{t.stripeHint}</p>
      )}
    </div>
  );
}
