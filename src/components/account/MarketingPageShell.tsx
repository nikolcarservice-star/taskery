import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  locale: AppLocale;
  dict: Dictionary;
  children: ReactNode;
  mainClassName?: string;
};

export function MarketingPageShell({
  locale,
  dict,
  children,
  mainClassName = "mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12",
}: MarketingPageShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />
      <main className={mainClassName}>{children}</main>
      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
