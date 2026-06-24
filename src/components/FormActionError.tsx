"use client";

import { translateActionError } from "@/lib/i18n/translate-action-error";
import { useDictionaryLocale } from "@/lib/i18n/dictionary-context";

type FormActionErrorProps = {
  error?: string;
  className?: string;
};

const defaultClassName = "text-sm text-red-600";

export function FormActionError({
  error,
  className = defaultClassName,
}: FormActionErrorProps) {
  const locale = useDictionaryLocale();
  if (!error) return null;

  const message = translateActionError(error, locale);

  return (
    <p className={className} role="alert">
      {message}
    </p>
  );
}
