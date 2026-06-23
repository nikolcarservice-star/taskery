"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { stripLocalePrefix } from "@/lib/i18n/routing";

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

export function ClientSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const l = useLocalizedPath();
  const dict = useDictionary();
  const nav = dict.cabinet;
  const c = nav.client;

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
      label: c.overview,
      href: l("/client"),
      icon: "🏠",
      match: (path) => path === "/client",
    },
    {
      type: "link",
      label: c.messages,
      href: l("/messages"),
      icon: "✉️",
    },
    {
      type: "link",
      label: c.projects,
      href: l("/client/projects"),
      icon: "📋",
      match: (path) =>
        path.startsWith("/client/projects") && path !== "/client/projects/new",
    },
    {
      type: "link",
      label: c.work,
      href: l("/client/work"),
      icon: "🚀",
      match: (path) => path.startsWith("/client/work"),
    },
    {
      type: "link",
      label: c.finances,
      href: l("/client/finances"),
      icon: "💰",
      match: (path) => path.startsWith("/client/finances"),
    },
    {
      type: "link",
      label: c.reviews,
      href: l("/client/reviews"),
      icon: "⭐",
      match: (path) => path.startsWith("/client/reviews"),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      type: "link",
      label: c.personal,
      href: l("/client/personal"),
      icon: "🗄️",
      match: (path) => path.startsWith("/client/personal"),
    },
    {
      type: "link",
      label: c.settings,
      href: l("/client/settings"),
      icon: "⚙️",
      match: (path) => path.startsWith("/client/settings"),
    },
    {
      type: "link",
      label: nav.support,
      href: l("/contact"),
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
