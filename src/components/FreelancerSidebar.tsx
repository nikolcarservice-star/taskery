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

type NavItem =
  | {
      type: "link";
      label: string;
      href: string;
      icon: ReactNode;
      match?: (pathname: string) => boolean;
    }
  | {
      type: "soon";
      label: string;
      icon: ReactNode;
    };

function NavRow({
  item,
  pathname,
  soonTitle,
}: {
  item: NavItem;
  pathname: string;
  soonTitle: string;
}) {
  if (item.type === "soon") {
    return (
      <span
        title={soonTitle}
        className="flex cursor-default items-center gap-3 px-4 py-2.5 text-sm text-zinc-400"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
          {item.icon}
        </span>
        {item.label}
      </span>
    );
  }

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
  soonTitle,
}: {
  items: NavItem[];
  pathname: string;
  soonTitle: string;
}) {
  return (
    <nav className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {items.map((item) => (
        <NavRow
          key={item.label}
          item={item}
          pathname={pathname}
          soonTitle={soonTitle}
        />
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
          type: "link",
          label: nav.adminCabinet,
          href: "/cabinet",
          icon: "🛡️",
          match: (path) => path === "/cabinet",
        },
        {
          type: "link",
          label: nav.adminPanel,
          href: "/admin",
          icon: "⚙️",
          match: (path) => path === "/admin",
        },
      ]
    : [];

  const mainItems: NavItem[] = [
    {
      type: "link",
      label: f.overview,
      href: l("/dashboard"),
      icon: "🏠",
      match: (path) => path === "/dashboard",
    },
    {
      type: "link",
      label: f.messages,
      href: l("/messages"),
      icon: "✉️",
    },
    {
      type: "link",
      label: f.bids,
      href: l("/dashboard/bids"),
      icon: "🔨",
    },
    { type: "soon", label: f.competitions, icon: "🏆" },
    {
      type: "link",
      label: f.finances,
      href: l("/dashboard/finances"),
      icon: "💰",
      match: (path) => path.startsWith("/dashboard/finances"),
    },
    {
      type: "link",
      label: f.portfolio,
      href: l("/dashboard/portfolio"),
      icon: "🎨",
      match: (path) => path.startsWith("/dashboard/portfolio"),
    },
    {
      type: "link",
      label: f.reviews,
      href: l("/dashboard/reviews"),
      icon: "⭐",
      match: (path) => path.startsWith("/dashboard/reviews"),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      type: "link",
      label: f.personal,
      href: l("/dashboard/personal"),
      icon: "🗄️",
      match: (path) => path.startsWith("/dashboard/personal"),
    },
    {
      type: "link",
      label: f.freelancerProfile,
      href: l("/dashboard/profile"),
      icon: "💻",
      match: (path) => path.startsWith("/dashboard/profile"),
    },
    {
      type: "link",
      label: f.settings,
      href: l("/dashboard/settings"),
      icon: "⚙️",
      match: (path) => path.startsWith("/dashboard/settings"),
    },
    {
      type: "link",
      label: f.boost,
      href: l("/boost"),
      icon: "⚡",
      match: (path) => path.startsWith("/boost"),
    },
    {
      type: "link",
      label: nav.support,
      href: l("/support"),
      icon: "🎧",
    },
    {
      type: "link",
      label: nav.whatsNew,
      href: l("/faq"),
      icon: "📣",
    },
  ];

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-[calc(68px+1.5rem)] space-y-4">
        {adminItems.length > 0 && (
          <SidebarBlock
            items={adminItems}
            pathname={pathname}
            soonTitle={nav.soon}
          />
        )}
        <SidebarBlock items={mainItems} pathname={pathname} soonTitle={nav.soon} />
        <SidebarBlock
          items={secondaryItems}
          pathname={pathname}
          soonTitle={nav.soon}
        />
      </div>
    </aside>
  );
}
