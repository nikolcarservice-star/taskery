"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { headerNavLinkClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

export function ClientFreelancersNavLink() {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <Link href={l("/freelancers")} className={headerNavLinkClass}>
      {dict.header.freelancers}
    </Link>
  );
}
