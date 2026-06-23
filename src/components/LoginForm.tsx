"use client";

import { loginWithCredentials, type LoginActionState } from "@/lib/actions/login";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { localizedPath } from "@/lib/i18n/routing";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { scrollFieldIntoView } from "@/lib/mobile-form-scroll";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";

const initialState: LoginActionState = {};

function LoginFormInner({ googleEnabled }: { googleEnabled: boolean }) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const sessionError = searchParams.get("error") === "session";
  const [state, formAction, pending] = useActionState(
    loginWithCredentials,
    initialState,
  );

  const errorMessage =
    state.error === "config"
      ? dict.auth.login.errors.config
      : state.error === "admin"
        ? dict.auth.login.errors.admin
        : state.error === "invalid"
          ? dict.auth.login.errors.invalid
          : sessionError
            ? dict.auth.login.errors.session
            : null;

  return (
    <>
      {googleEnabled && (
        <>
          <GoogleAuthButton
            label={dict.auth.login.google}
            mode="login"
            disabled={pending}
          />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500">{dict.auth.login.orDivider}</span>
            </div>
          </div>
        </>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            {dict.auth.login.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
            onFocus={scrollFieldIntoView}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700"
          >
            {dict.auth.login.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
            onFocus={scrollFieldIntoView}
          />
          <p className="mt-1 text-right">
            <a
              href={localizedPath(locale, "/forgot-password")}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              {dict.auth.login.forgotPassword}
            </a>
          </p>
        </div>
        {errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
            {state.error === "admin" && (
              <>
                {" "}
                <Link href={localizedPath(locale, "/admin")} className="font-medium underline">
                  {dict.cabinet.adminPanel}
                </Link>
              </>
            )}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? dict.auth.login.loading : dict.auth.login.submit}
        </button>
      </form>
    </>
  );
}

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  return (
    <Suspense>
      <LoginFormInner googleEnabled={googleEnabled} />
    </Suspense>
  );
}
