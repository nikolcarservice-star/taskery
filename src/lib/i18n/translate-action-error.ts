import { translateActionErrorCode } from "@/lib/action-errors-i18n";
import type { AppLocale } from "@/lib/i18n/types";

export function translateActionError(
  error: string | undefined,
  locale: AppLocale,
): string | undefined {
  if (!error) return undefined;
  return translateActionErrorCode(locale, error);
}
