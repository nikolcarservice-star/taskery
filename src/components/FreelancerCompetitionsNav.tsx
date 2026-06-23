"use client";

import { headerNavLinkMutedClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";

export function FreelancerCompetitionsNav() {
  const dict = useDictionary();

  return (
    <span className={headerNavLinkMutedClass} title={dict.cabinet.soon}>
      {dict.header.competitions}
    </span>
  );
}
