"use client";

import { createSupportTicket, type TicketActionState } from "@/lib/actions/support-tickets";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { localizedPath } from "@/lib/i18n/routing";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState: TicketActionState = {};

const CATEGORY_KEYS = [
  "GENERAL",
  "PAYMENT",
  "DISPUTE",
  "ACCOUNT",
  "OTHER",
] as const;

export function CreateSupportTicketForm() {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const t = dict.support.form;
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createSupportTicket,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.push(localizedPath(locale, "/support"));
      router.refresh();
    }
  }, [state.success, router, locale]);

  if (state.success) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-sm text-green-800">
        {t.successRedirect}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-zinc-700">
          {t.category}
        </label>
        <select
          id="category"
          name="category"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          {CATEGORY_KEYS.map((key) => (
            <option key={key} value={key}>
              {t.categories[key]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-zinc-700">
          {t.subject}
        </label>
        <input
          id="subject"
          name="subject"
          required
          minLength={3}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
