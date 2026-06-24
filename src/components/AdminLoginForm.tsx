"use client";

import {
  loginWithAdminCredentials,
  type AdminLoginActionState,
} from "@/lib/actions/login";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";

const initialState: AdminLoginActionState = {};

function AdminLoginFormInner({ locale }: { locale: AppLocale }) {
  const l = getAdminCopy(locale).panels.login;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/mobile";
  const [state, formAction, pending] = useActionState(
    loginWithAdminCredentials,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium text-zinc-700">
          {l.emailLabel}
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />
      </div>
      <div>
        <label
          htmlFor="admin-password"
          className="block text-sm font-medium text-zinc-700"
        >
          {l.passwordLabel}
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />
      </div>
      <div>
        <label htmlFor="admin-totp" className="block text-sm font-medium text-zinc-700">
          {l.totpLabel}
        </label>
        <input
          id="admin-totp"
          name="totpCode"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="mt-1 w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {l.errorInvalid}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? l.signingIn : l.submit}
      </button>
    </form>
  );
}

export function AdminLoginForm({ locale }: { locale: AppLocale }) {
  return (
    <Suspense>
      <AdminLoginFormInner locale={locale} />
    </Suspense>
  );
}
