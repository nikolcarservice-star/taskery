import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  locale: AppLocale;
  dict: Dictionary;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

export function AuthPageShell({
  locale,
  dict,
  title,
  subtitle,
  children,
}: AuthPageShellProps) {
  return (
    <div className="auth-page-shell flex min-h-[100dvh] flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />

      <main className="auth-page-main mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:flex lg:flex-col lg:justify-center">
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        {subtitle ? <div className="mt-2 text-sm text-zinc-600">{subtitle}</div> : null}

        <div className="auth-page-card mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-6">
          {children}
        </div>
      </main>

      <div className="auth-page-footer hidden shrink-0 lg:block">
        <SiteFooter locale={locale} dict={dict} />
      </div>
    </div>
  );
}
