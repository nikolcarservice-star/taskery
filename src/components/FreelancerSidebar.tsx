"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { stripLocalePrefix } from "@/lib/i18n/routing";

type FreelancerSidebarProps = {
  isAdmin?: boolean;
};

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  match?: (pathname: string) => boolean;
};

function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
  const path = stripLocalePrefix(pathname);
  const active = item.match
    ? item.match(path)
    : path === stripLocalePrefix(item.href) ||
      path.startsWith(`${stripLocalePrefix(item.href)}/`);

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

export function FreelancerSidebar({ isAdmin = false }: FreelancerSidebarProps) {
  const pathname = usePathname();
  const l = useLocalizedPath();
  const dict = useDictionary();
  const nav = dict.cabinet;
  const f = nav.freelancer;

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
      label: f.overview,
      href: l("/dashboard"),
      icon: "🏠",
      match: (path) => path === "/dashboard",
    },
    {
      label: f.messages,
      href: l("/messages"),
      icon: "✉️",
    },
    {
      label: f.bids,
      href: l("/dashboard/bids"),
      icon: "🔨",
    },
    {
      label: f.finances,
      href: l("/dashboard/finances"),
      icon: "💰",
      match: (path) => path.startsWith("/dashboard/finances"),
    },
    {
      label: f.portfolio,
      href: l("/dashboard/portfolio"),
      icon: "🎨",
      match: (path) => path.startsWith("/dashboard/portfolio"),
    },
    {
      label: f.reviews,
      href: l("/dashboard/reviews"),
      icon: "⭐",
      match: (path) => path.startsWith("/dashboard/reviews"),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      label: f.personal,
      href: l("/dashboard/personal"),
      icon: "🗄️",
      match: (path) => path.startsWith("/dashboard/personal"),
    },
    {
      label: f.freelancerProfile,
      href: l("/dashboard/profile"),
      icon: "💻",
      match: (path) => path.startsWith("/dashboard/profile"),
    },
    {
      label: f.settings,
      href: l("/dashboard/settings"),
      icon: "⚙️",
      match: (path) => path.startsWith("/dashboard/settings"),
    },
    {
      label: f.boost,
      href: l("/boost"),
      icon: "⚡",
      match: (path) => path.startsWith("/boost"),
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
