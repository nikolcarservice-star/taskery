"use client";

import { GuestHeader } from "@/components/GuestHeader";
import { RegisterForm } from "@/components/RegisterForm";
import { SiteFooter } from "@/components/SiteFooter";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import Link from "next/link";

type RegisterPageClientProps = {
  googleEnabled: boolean;
  locale: AppLocale;
  dict: Dictionary;
};

export function RegisterPageClient({
  googleEnabled,
  locale,
  dict,
}: RegisterPageClientProps) {
  const { auth: authCopy } = dict;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <GuestHeader locale={locale} dict={dict} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">{authCopy.register.h1}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {authCopy.register.hasAccount}{" "}
          <Link
            href={localizedPath(locale, "/login")}
            className="text-blue-600 underline"
          >
            {authCopy.register.loginLink}
          </Link>
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <RegisterForm googleEnabled={googleEnabled} />
        </div>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
