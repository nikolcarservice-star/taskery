"use client";

import { submitContactForm, type ContactState } from "@/lib/actions/contact";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useActionState } from "react";

const initialState: ContactState = {};

export function ContactForm() {
  const dict = useDictionary();
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  if (state.success) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-sm text-green-800">
        {dict.publicForms.contact.success}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          {dict.publicForms.contact.name}
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          {dict.publicForms.contact.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-zinc-700"
        >
          {dict.publicForms.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? dict.publicForms.contact.submitting : dict.publicForms.contact.submit}
      </button>
    </form>
  );
}
