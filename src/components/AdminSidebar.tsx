"use client";

import { AdminModeLink } from "@/components/AdminModeLink";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminWorkMode } from "@/lib/admin-work-mode";
import type { AppLocale } from "@/lib/i18n/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  match?: (pathname: string) => boolean;
  highlight?: boolean;
  mode?: AdminWorkMode;
};

function navClassName(active: boolean, highlight?: boolean) {
  if (active) {
    return highlight
      ? "border-l-[3px] border-red-500 bg-red-50 font-medium text-red-900"
      : "border-l-[3px] border-indigo-500 bg-zinc-100 font-medium text-zinc-900";
  }

  return highlight
    ? "border-l-[3px] border-transparent text-red-700 hover:bg-red-50"
    : "border-l-[3px] border-transparent text-zinc-700 hover:bg-zinc-50";
}

function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.match
    ? item.match(pathname)
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const className = `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${navClassName(active, item.highlight)}`;

  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
        {item.icon}
      </span>
      {item.label}
    </>
  );

  if (item.mode) {
    return (
      <AdminModeLink mode={item.mode} href={item.href} className={className}>
        {content}
      </AdminModeLink>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

type AdminSidebarProps = {
  locale: AppLocale;
};

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();
  const chrome = getAdminCopy(locale).panels.chrome;

  const items: NavItem[] = [
    {
      label: chrome.myCabinet,
      href: "/cabinet",
      icon: "🏠",
      match: (path) => path === "/cabinet",
    },
    {
      label: chrome.workAsClient,
      href: "/client",
      icon: "📋",
      mode: "client",
      match: (path) => path.startsWith("/client"),
    },
    {
      label: chrome.workAsFreelancer,
      href: "/dashboard",
      icon: "💻",
      mode: "freelancer",
      match: (path) => path.startsWith("/dashboard"),
    },
    {
      label: chrome.messages,
      href: "/messages",
      icon: "✉️",
      match: (path) => path.startsWith("/messages"),
    },
    {
      label: chrome.adminPanel,
      href: "/admin/mobile",
      icon: "🛡️",
      match: (path) => path === "/admin" || path.startsWith("/admin/"),
      highlight: true,
    },
  ];

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav className="sticky top-[calc(68px+1.5rem)] overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {items.map((item) => (
          <NavRow key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
