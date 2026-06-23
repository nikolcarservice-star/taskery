"use client";

import { acceptBid, type ActionState } from "@/lib/actions/contracts";
import { FormActionError } from "@/components/FormActionError";
import { formatMoney } from "@/lib/i18n/currencies";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState: ActionState = {};

type AcceptBidButtonProps = {
  bidId: string;
  freelancerName: string | null;
  cost: number;
  currency: string;
};

export function AcceptBidButton({
  bidId,
  freelancerName,
  cost,
  currency,
}: AcceptBidButtonProps) {
  const locale = useDictionaryLocale();
  const dict = useDictionary();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(acceptBid, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (state.success) {
    return (
      <p className="mt-3 text-sm font-medium text-green-700">
          {dict.projectDetail.acceptBid.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="bidId" value={bidId} />
      <FormActionError error={state.error} className="mb-2 text-sm text-red-600" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending
          ? dict.projectDetail.acceptBid.pending
          : `${dict.projectDetail.acceptBid.submitPrefix} · ${formatMoney(cost, currency, locale)}`}
      </button>
      <p className="mt-1 text-xs text-zinc-500">
        {dict.projectDetail.acceptBid.hint
          .replace("{name}", freelancerName ?? dict.projectDetail.common.freelancerFallback)}
      </p>
    </form>
  );
}
