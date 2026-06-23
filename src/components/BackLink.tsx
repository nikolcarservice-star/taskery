"use client";

import Link from "next/link";
import { useDictionary } from "@/lib/i18n/dictionary-context";

type BackLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

function BackArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19 8 12l7-7"
      />
    </svg>
  );
}

export function BackLink({
  href,
  label,
  className = "",
}: BackLinkProps) {
  const dict = useDictionary();
  const resolvedLabel = label ?? dict.common.back;

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 ${className}`}
    >
      <BackArrowIcon />
      {resolvedLabel}
    </Link>
  );
}
