"use client";

import { AdminPanelNavButton } from "@/components/AdminPanelNavButton";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { headerGhostButtonClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

type FreelancerHeaderActionsProps = {
  isAdmin: boolean;
};

export function FreelancerHeaderActions({ isAdmin }: FreelancerHeaderActionsProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <div className="ml-6 hidden items-center gap-x-3 lg:ml-10 lg:flex lg:gap-x-4">
      <Link href={l("/projects")} className={headerGhostButtonClass}>
        {dict.header.findProject}
      </Link>
      {isAdmin && <AdminPanelNavButton />}
    </div>
  );
}
