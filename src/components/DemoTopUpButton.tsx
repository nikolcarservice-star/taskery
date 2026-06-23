"use client";

import { demoTopUpBalance, type ActionState } from "@/lib/actions/contracts";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useActionState } from "react";

const initialState: ActionState = {};

export function DemoTopUpButton() {
  const dict = useDictionary();
  const t = dict.billing.demoTopUp;
  const [state, formAction, pending] = useActionState(
    demoTopUpBalance,
    initialState,
  );

  return (
    <form action={formAction} className="mt-3">
      <FormActionError error={state.error} className="mb-2 text-sm text-red-600" />
      {state.success ? (
        <p className="text-sm font-medium text-green-700">{t.success}</p>
      ) : (
        <>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            {pending ? t.loading : t.submit}
          </button>
          <p className="mt-1 text-xs text-zinc-500">{t.hint}</p>
        </>
      )}
    </form>
  );
}
