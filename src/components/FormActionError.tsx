"use client";

import { translateActionError } from "@/lib/i18n/translate-action-error";
import { useOptionalDictionary } from "@/lib/i18n/dictionary-context";

type FormActionErrorProps = {
  error?: string;
  className?: string;
};

const defaultClassName = "text-sm text-red-600";

export function FormActionError({
  error,
  className = defaultClassName,
}: FormActionErrorProps) {
  const dict = useOptionalDictionary();
  if (!error) return null;

  const message = dict ? translateActionError(error, dict) : error;

  return (
    <p className={className} role="alert">
      {message}
    </p>
  );
}
