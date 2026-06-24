"use client";

import { translateActionErrorCode } from "@/lib/action-errors-i18n";
import type { AppLocale } from "@/lib/i18n/types";

type AdminActionErrorProps = {
  error?: string;
  locale: AppLocale;
  className?: string;
};

const defaultClassName = "text-sm text-red-600";

export function AdminActionError({
  error,
  locale,
  className = defaultClassName,
}: AdminActionErrorProps) {
  if (!error) return null;

  return (
    <p className={className} role="alert">
      {translateActionErrorCode(locale, error)}
    </p>
  );
}
