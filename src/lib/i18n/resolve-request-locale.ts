import { defaultLocale, isAppLocale } from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";
import { resolvePreferredLocale } from "@/lib/i18n/routing";

/** Guest / anonymous: cookie → Accept-Language → default. */
export function resolveGuestLocale(
  cookieLocale: string | undefined,
  acceptLanguage: string | null,
): AppLocale {
  return resolvePreferredLocale(cookieLocale, acceptLanguage);
}

/**
 * Logged-in user: DB interfaceLanguage wins over cookie.
 * Cookie from the marketing site applies only when DB still has the default locale.
 */
export function resolveAuthenticatedLocale(
  interfaceLanguage: string | undefined | null,
  cookieLocale: string | undefined,
  acceptLanguage: string | null,
): AppLocale {
  const dbLocale =
    interfaceLanguage && isAppLocale(interfaceLanguage)
      ? interfaceLanguage
      : null;

  if (dbLocale && dbLocale !== defaultLocale) {
    return dbLocale;
  }

  if (cookieLocale && isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (dbLocale) {
    return dbLocale;
  }

  return resolvePreferredLocale(cookieLocale, acceptLanguage);
}

export function resolveRequestLocale(options: {
  interfaceLanguage?: string | null;
  cookieLocale?: string;
  acceptLanguage?: string | null;
  isAuthenticated: boolean;
}): AppLocale {
  const { interfaceLanguage, cookieLocale, acceptLanguage, isAuthenticated } =
    options;

  if (isAuthenticated) {
    return resolveAuthenticatedLocale(
      interfaceLanguage,
      cookieLocale,
      acceptLanguage ?? null,
    );
  }

  return resolveGuestLocale(cookieLocale, acceptLanguage ?? null);
}
