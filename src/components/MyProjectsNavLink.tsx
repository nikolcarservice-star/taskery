"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { headerNavLinkClass } from "@/components/HeaderShell";
import Link from "next/link";

type MyProjectsNavLinkProps = {
  hasActiveProjects: boolean;
};

export function MyProjectsNavLink({ hasActiveProjects }: MyProjectsNavLinkProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <Link href={l("/client/work")} className={headerNavLinkClass}>
      {dict.header.myProjectsInProgress}
      {!hasActiveProjects && (
        <span className="sr-only"> — {dict.header.noActiveProjectsSr}</span>
      )}
    </Link>
  );
}
