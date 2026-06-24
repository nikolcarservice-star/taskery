"use client";

import { getAdminCopy } from "@/lib/admin-i18n";
import { useDictionaryLocale } from "@/lib/i18n/dictionary-context";

type AdminBadgeProps = {
  size?: "xs" | "sm";
  className?: string;
};

const sizeClasses = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
} as const;

export function AdminBadge({ size = "xs", className = "" }: AdminBadgeProps) {
  const locale = useDictionaryLocale();
  const title = getAdminCopy(locale).panels.chrome.adminFallback;

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-red-100 font-semibold uppercase tracking-wide text-red-700 ring-1 ring-red-200 ${sizeClasses[size]} ${className}`}
      title={title}
    >
      Admin
    </span>
  );
}
