"use client";

import { AuthPageShell } from "@/components/account/AuthPageShell";
import { RegisterForm } from "@/components/RegisterForm";
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
    <AuthPageShell
      locale={locale}
      dict={dict}
      title={authCopy.register.h1}
      subtitle={
        <>
          {authCopy.register.hasAccount}{" "}
          <Link
            href={localizedPath(locale, "/login")}
            className="text-indigo-600 underline"
          >
            {authCopy.register.loginLink}
          </Link>
        </>
      }
    >
      <RegisterForm googleEnabled={googleEnabled} />
    </AuthPageShell>
  );
}
