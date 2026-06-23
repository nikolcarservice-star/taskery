"use client";

import { createBid, type CreateBidState } from "@/lib/actions/bids";
import { FormActionError } from "@/components/FormActionError";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import { useActionState, useEffect } from "react";

type BidFormProps = {
  projectId: string;
  currency: string;
};

const initialState: CreateBidState = {};

export function BidForm({ projectId, currency }: BidFormProps) {
  const dict = useDictionary();
  const [state, formAction, pending] = useActionState(createBid, initialState);

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [state.success]);

  const inputClassName =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-sm text-green-800">
        <p className="font-medium">{dict.projectDetail.bidForm.successTitle}</p>
        <p className="mt-1">
          {dict.projectDetail.bidForm.successText}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-zinc-700">
            {dict.projectDetail.bidForm.costLabel.replace("{currency}", currency)}
          </label>
          <input
            id="cost"
            name="cost"
            type="number"
            required
            min={1}
            step={1}
            placeholder="8000"
            className={inputClassName}
          />
        </div>
        <div>
          <label
            htmlFor="timeframe"
            className="block text-sm font-medium text-zinc-700"
          >
            {dict.projectDetail.bidForm.timeframeLabel}
          </label>
          <input
            id="timeframe"
            name="timeframe"
            type="number"
            required
            min={1}
            step={1}
            placeholder="14"
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="coverLetter"
          className="block text-sm font-medium text-zinc-700"
        >
          {dict.projectDetail.bidForm.coverLetterLabel}
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          required
          minLength={20}
          rows={6}
          placeholder={dict.projectDetail.bidForm.coverLetterPlaceholder}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-zinc-500">{dict.projectDetail.bidForm.coverLetterHint}</p>
      </div>

      <FormActionError error={state.error} className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" />

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? dict.projectDetail.bidForm.submitting : dict.projectDetail.bidForm.submit}
      </button>
    </form>
  );
}

export function BidLoginPrompt({ callbackUrl }: { callbackUrl: string }) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
      <p className="font-medium text-zinc-900">{dict.projectDetail.bidForm.loginPromptTitle}</p>
      <p className="mt-1">
        {dict.projectDetail.bidForm.loginPromptTextPrefix}
        <Link href={l("/register")} className="text-blue-600 underline">
          {dict.projectDetail.bidForm.registerLink}
        </Link>
        {dict.projectDetail.bidForm.loginPromptTextSuffix}
      </p>
      <Link
        href={`${l("/login")}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        {dict.projectDetail.bidForm.loginCta}
      </Link>
    </div>
  );
}
