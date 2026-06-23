"use client";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { isAdminEmail } from "@/lib/actions/auth-hints";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { localizedPath } from "@/lib/i18n/routing";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginFormInner({ googleEnabled }: { googleEnabled: boolean }) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const searchParams = useSearchParams();
  const callbackUrl = safeRedirectPath(searchParams.get("callbackUrl"), "/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      const adminAccount = await isAdminEmail(email);
      setError(
        adminAccount
          ? dict.auth.login.errors.admin
          : dict.auth.login.errors.invalid,
      );
      setLoading(false);
      return;
    }

    window.location.assign(callbackUrl);
  }

  return (
    <>
      {googleEnabled && (
        <>
          <GoogleAuthButton
            label={dict.auth.login.google}
            mode="login"
            disabled={loading}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            {dict.auth.login.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
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
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
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
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
            {error === dict.auth.login.errors.admin && (
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
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? dict.auth.login.loading : dict.auth.login.submit}
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
