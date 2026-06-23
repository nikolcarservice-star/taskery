import {
  APP_LOCALES,
  defaultLocale,
  isAppLocale,
  LOCALE_COOKIE,
} from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";
import { absoluteUrl } from "@/lib/site-url";

export type ParsedPathname = {
  locale: AppLocale | null;
  pathnameWithoutLocale: string;
};

export function parsePathname(pathname: string): ParsedPathname {
  const segment = pathname.split("/")[1];

  if (segment && isAppLocale(segment)) {
    const rest = pathname.slice(segment.length + 1);
    return {
      locale: segment,
      pathnameWithoutLocale: rest ? rest : "/",
    };
  }

  return { locale: null, pathnameWithoutLocale: pathname };
}

export function stripLocalePrefix(pathname: string): string {
  return parsePathname(pathname).pathnameWithoutLocale;
}

export function localizedPath(locale: AppLocale, path = "/"): string {
  const withoutLocale = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);
  const normalized = withoutLocale === "/" ? "" : withoutLocale;

  if (!normalized) {
    return `/${locale}`;
  }

  return `/${locale}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
  return parsePathname(pathname).locale;
}

export function buildLocaleAlternates(path = "/"): Record<string, string> {
  const withoutLocale = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);
  const normalized = withoutLocale === "/" ? "" : withoutLocale;

  const languages = Object.fromEntries(
    APP_LOCALES.map((locale) => [
      locale,
      absoluteUrl(localizedPath(locale, normalized || "/")),
    ]),
  );

  return {
    ...languages,
    "x-default": absoluteUrl(localizedPath(defaultLocale, normalized || "/")),
  };
}

/** Routes that should live under /[locale]/... */
export const LOCALIZED_ROUTE_ROOTS = [
  "about",
  "faq",
  "contact",
  "pricing",
  "projects",
  "freelancers",
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "dashboard",
  "client",
  "boost",
  "terms",
  "privacy",
  "messages",
  "notifications",
  "profile",
  "billing",
] as const;

export function isLegacyLocalizedPath(pathname: string): boolean {
  const { locale, pathnameWithoutLocale } = parsePathname(pathname);
  if (locale) {
    return false;
  }

  const segment = pathnameWithoutLocale.split("/").filter(Boolean)[0];
  if (!segment) {
    return false;
  }

  return (LOCALIZED_ROUTE_ROOTS as readonly string[]).includes(segment);
}

export function resolvePreferredLocale(
  cookieLocale: string | undefined,
  acceptLanguage: string | null,
): AppLocale {
  if (cookieLocale && isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const language = part.trim().split(";")[0]?.toLowerCase();
      const base = language?.split("-")[0];
      if (base && isAppLocale(base)) {
        return base;
      }
    }
  }

  return defaultLocale;
}

export { LOCALE_COOKIE };
