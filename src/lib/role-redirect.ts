import type { Role } from "@/generated/prisma/client";
import { defaultLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routing";
import type { AppLocale } from "@/lib/i18n/types";

export function getHomeRouteForRole(
  role?: Role | null,
  locale: AppLocale = defaultLocale,
) {
  switch (role) {
    case "FREELANCER":
      return localizedPath(locale, "/dashboard");
    case "CLIENT":
      return localizedPath(locale, "/client");
    case "ADMIN":
      return "/cabinet";
    default:
      return localizedPath(locale, "/profile");
  }
}

export function getLoginPath(locale: AppLocale = defaultLocale) {
  return localizedPath(locale, "/login");
}
