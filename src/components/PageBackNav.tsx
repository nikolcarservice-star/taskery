"use client";

import { BackLink } from "@/components/BackLink";
import { getBackTarget } from "@/lib/back-navigation";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type PageBackNavProps = {
  className?: string;
};

export function PageBackNav({ className = "mb-5" }: PageBackNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const dict = useDictionary();

  if (!session?.user) {
    return null;
  }

  const target = getBackTarget(pathname, session.user.role, dict.backNav);

  if (!target) {
    return null;
  }

  return (
    <BackLink href={target.href} label={target.label} className={className} />
  );
}
