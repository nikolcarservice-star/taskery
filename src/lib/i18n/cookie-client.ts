import { LOCALE_COOKIE } from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function setLocaleCookie(locale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}
