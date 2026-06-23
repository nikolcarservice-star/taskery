"use client";

import Link from "next/link";
import { useAppLocale } from "@/lib/i18n/use-app-locale";
import { localizedPath } from "@/lib/i18n/routing";

type LocalizedLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function LocalizedLink({ href, className, children }: LocalizedLinkProps) {
  const locale = useAppLocale();
  return (
    <Link href={localizedPath(locale, href)} className={className}>
      {children}
    </Link>
  );
}

export function useLocalizedPath() {
  const locale = useAppLocale();
  return (path: string) => localizedPath(locale, path);
}
