"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";

export function FeaturedBadge({ className = "" }: { className?: string }) {
  const dict = useDictionary();

  return (
    <span
      className={`inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 ${className}`}
    >
      {dict.projectDetail.featuredBadge}
    </span>
  );
}
