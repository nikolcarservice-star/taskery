"use client";

import { chooseAdminWorkMode } from "@/lib/actions/admin-work-mode";
import type { AdminWorkMode } from "@/lib/admin-work-mode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

type AdminModeLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  mode: AdminWorkMode;
  href: string;
  children: ReactNode;
};

export function AdminModeLink({
  mode,
  href,
  children,
  ...props
}: AdminModeLinkProps) {
  const router = useRouter();

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    await chooseAdminWorkMode(mode);
    router.push(href);
    router.refresh();
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
