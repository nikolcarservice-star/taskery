import { isActionErrorCode } from "@/lib/action-errors";
import type { Dictionary } from "@/lib/i18n/types";

export function translateActionError(
  error: string | undefined,
  dict: Dictionary,
): string | undefined {
  if (!error) return undefined;
  if (isActionErrorCode(error)) {
    return dict.actionErrors[error] ?? error;
  }
  return error;
}
