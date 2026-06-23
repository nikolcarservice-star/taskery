import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  isAppLocale,
  LOCALE_COOKIE,
} from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";
import {
  getLocaleFromPathname,
  resolvePreferredLocale,
} from "@/lib/i18n/routing";

export async function getLocale(pathname?: string): Promise<AppLocale> {
  if (pathname) {
    const fromPath = getLocaleFromPathname(pathname);
    if (fromPath) {
      return fromPath;
    }
  }

  const headerStore = await headers();
  const headerLocale = headerStore.get("x-taskery-locale");
  if (headerLocale && isAppLocale(headerLocale)) {
    return headerLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  return resolvePreferredLocale(cookieLocale, headerStore.get("accept-language"));
}
