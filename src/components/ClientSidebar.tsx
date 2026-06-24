"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { stripLocalePrefix } from "@/lib/i18n/routing";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  match?: (pathname: string) => boolean;
};

function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.match
    ? item.match(stripLocalePrefix(pathname))
    : stripLocalePrefix(pathname) === stripLocalePrefix(item.href) ||
      stripLocalePrefix(pathname).startsWith(`${stripLocalePrefix(item.href)}/`);

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        active
          ? "border-l-[3px] border-indigo-500 bg-zinc-100 font-medium text-zinc-900"
          : "border-l-[3px] border-transparent text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function SidebarBlock({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  return (
    <nav className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {items.map((item) => (
        <NavRow key={item.label} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

export function ClientSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const l = useLocalizedPath();
  const dict = useDictionary();
  const nav = dict.cabinet;
  const c = nav.client;

  const adminItems: NavItem[] = isAdmin
    ? [
        {
          label: nav.adminCabinet,
          href: "/cabinet",
          icon: "🛡️",
          match: (path) => path === "/cabinet",
        },
        {
          label: nav.adminPanel,
          href: "/admin",
          icon: "⚙️",
          match: (path) => path === "/admin",
        },
      ]
    : [];

  const mainItems: NavItem[] = [
    {
      label: c.overview,
      href: l("/client"),
      icon: "🏠",
      match: (path) => path === "/client",
    },
    {
      label: c.messages,
      href: l("/messages"),
      icon: "✉️",
    },
    {
      label: c.projects,
      href: l("/client/projects"),
      icon: "📋",
      match: (path) =>
        path.startsWith("/client/projects") && path !== "/client/projects/new",
    },
    {
      label: c.work,
      href: l("/client/work"),
      icon: "🚀",
      match: (path) => path.startsWith("/client/work"),
    },
    {
      label: c.finances,
      href: l("/client/finances"),
      icon: "💰",
      match: (path) => path.startsWith("/client/finances"),
    },
    {
      label: c.reviews,
      href: l("/client/reviews"),
      icon: "⭐",
      match: (path) => path.startsWith("/client/reviews"),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      label: c.personal,
      href: l("/client/personal"),
      icon: "🗄️",
      match: (path) => path.startsWith("/client/personal"),
    },
    {
      label: c.settings,
      href: l("/client/settings"),
      icon: "⚙️",
      match: (path) => path.startsWith("/client/settings"),
    },
    {
      label: nav.support,
      href: l("/support"),
      icon: "🎧",
    },
    {
      label: nav.whatsNew,
      href: l("/faq"),
      icon: "📣",
    },
  ];

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-[calc(68px+1.5rem)] space-y-4">
        {adminItems.length > 0 && (
          <SidebarBlock items={adminItems} pathname={pathname} />
        )}
        <SidebarBlock items={mainItems} pathname={pathname} />
        <SidebarBlock items={secondaryItems} pathname={pathname} />
      </div>
    </aside>
  );
}
