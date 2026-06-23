"use client";

import { FormActionError } from "@/components/FormActionError";
import {
  requestPasswordReset,
  resetPassword,
  type ActionState,
} from "@/lib/actions/password";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import { useActionState } from "react";

const initialState: ActionState = {};

export function ForgotPasswordForm() {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state.success) {
    return (
      <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
        {dict.publicForms.password.forgotSuccess}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? dict.publicForms.password.forgotSubmitting : dict.publicForms.password.forgotSubmit}
      </button>
      <p className="text-center text-sm text-zinc-600">
        <Link href={l("/login")} className="font-medium text-blue-600 hover:underline">
          {dict.publicForms.password.backToLogin}
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  if (state.success) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
          {dict.publicForms.password.resetSuccess}
        </div>
        <Link
          href={l("/login")}
          className="block w-full rounded-full bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-700"
        >
          {dict.publicForms.password.resetCta}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-700"
        >
          {dict.publicForms.password.newPassword}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-500">{dict.publicForms.password.minHint}</p>
      </div>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? dict.publicForms.password.resetSubmitting : dict.publicForms.password.resetSubmit}
      </button>
    </form>
  );
}
