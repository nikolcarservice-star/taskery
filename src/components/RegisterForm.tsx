"use client";

import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { scrollFieldIntoView } from "@/lib/mobile-form-scroll";
import { signInAfterRegister } from "@/lib/actions/login";
import { getHomeRouteForRole } from "@/lib/role-redirect";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { useLocalizedPath } from "@/components/LocalizedLink";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function RegisterFormInner({ googleEnabled }: { googleEnabled: boolean }) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const errorMessages: Record<string, string> = {
    oauth_role_required: dict.auth.register.errors.oauthRoleRequired,
    invalid_role: dict.auth.register.errors.invalidRole,
  };

  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "FREELANCER">("CLIENT");
  const [error, setError] = useState<string | null>(
    oauthError ? (errorMessages[oauthError] ?? dict.auth.register.errors.oauth) : null,
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(
        data.error === "Email already registered"
          ? dict.auth.register.errors.emailRegistered
          : (data.error ?? dict.auth.register.errors.createFailed),
      );
      setLoading(false);
      return;
    }

    try {
      await signInAfterRegister(
        email,
        password,
        getHomeRouteForRole(role, locale),
      );
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      setError(dict.auth.register.errors.autoLoginFailed);
      setLoading(false);
    }
  }

  return (
    <>
      {googleEnabled && (
        <>
          <GoogleAuthButton
            label={dict.auth.register.google}
            mode="register"
            role={role}
            disabled={loading}
          />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500">{dict.auth.register.orDivider}</span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
            {dict.auth.register.name}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
            onFocus={scrollFieldIntoView}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            {dict.auth.register.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
            onFocus={scrollFieldIntoView}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700"
          >
            {dict.auth.register.password}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
            onFocus={scrollFieldIntoView}
          />
          <p className="mt-1 text-xs text-zinc-500">{dict.auth.register.passwordHint}</p>
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-zinc-700">{dict.auth.register.roleLegend}</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(
              [
                { value: "CLIENT", label: dict.auth.register.role.client },
                { value: "FREELANCER", label: dict.auth.register.role.freelancer },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  role === option.value
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? dict.auth.register.loading : dict.auth.register.submit}
        </button>
        <p className="text-center text-xs text-zinc-500">
          {dict.auth.register.agreementPrefix}
          <Link href={l("/terms")} className="underline">
            {dict.auth.register.terms}
          </Link>{" "}
          {dict.auth.register.agreementMiddle}
          <Link href={l("/privacy")} className="underline">
            {dict.auth.register.privacy}
          </Link>
          {dict.auth.register.agreementSuffix}
        </p>
      </form>
    </>
  );
}

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  return (
    <Suspense>
      <RegisterFormInner googleEnabled={googleEnabled} />
    </Suspense>
  );
}
