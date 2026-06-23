"use client";

import { startStripeConnectOnboarding, type StripeConnectState } from "@/lib/actions/stripe-connect";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useActionState } from "react";

type StripeConnectSettingsProps = {
  connectEnabled: boolean;
  payoutsEnabled: boolean;
  accountLinked: boolean;
};

const initialState: StripeConnectState = {};

export function StripeConnectSettings({
  connectEnabled,
  payoutsEnabled,
  accountLinked,
}: StripeConnectSettingsProps) {
  const dict = useDictionary();
  const t = dict.cabinetForms.personalData;
  const [state, formAction, pending] = useActionState(
    startStripeConnectOnboarding,
    initialState,
  );

  if (!connectEnabled) {
    return null;
  }

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
      <h3 className="text-sm font-semibold text-zinc-900">{t.stripeConnectTitle}</h3>
      <p className="mt-1 text-sm text-zinc-600">{t.stripeConnectDescription}</p>

      {payoutsEnabled ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          {t.stripeConnectReady}
        </p>
      ) : accountLinked ? (
        <p className="mt-3 text-sm text-amber-800">{t.stripeConnectPending}</p>
      ) : (
        <p className="mt-3 text-sm text-zinc-600">{t.stripeConnectNotLinked}</p>
      )}

      <form action={formAction} className="mt-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending
            ? t.stripeConnectStarting
            : payoutsEnabled
              ? t.stripeConnectManage
              : t.stripeConnectStart}
        </button>
        <FormActionError error={state.error} className="mt-2 text-sm text-red-600" />
      </form>
    </div>
  );
}
