"use client";

import { defaultLocale } from "@/lib/i18n/config";
import { getLocaleFromPathname, localizedPath } from "@/lib/i18n/routing";
import type { AppLocale } from "@/lib/i18n/types";
import { usePathname } from "next/navigation";

export function useAppLocale(): AppLocale {
  const pathname = usePathname();
  return getLocaleFromPathname(pathname) ?? defaultLocale;
}
