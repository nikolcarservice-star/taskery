"use client";

import { AdminPanelNavButton } from "@/components/AdminPanelNavButton";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { headerGhostButtonClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

type ClientHeaderActionsProps = {
  isAdmin: boolean;
};

export function ClientHeaderActions({ isAdmin }: ClientHeaderActionsProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <div className="ml-6 hidden items-center gap-x-3 lg:ml-10 lg:flex lg:gap-x-4">
      <Link href={l("/client/projects/new")} className={headerGhostButtonClass}>
        {dict.header.newProject}
      </Link>
      {isAdmin && <AdminPanelNavButton />}
    </div>
  );
}
