"use client";

import { AdminModeLink } from "@/components/AdminModeLink";
import type { AdminWorkMode } from "@/lib/admin-work-mode";
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

export function AdminSidebar() {
  const pathname = usePathname();

  const items: NavItem[] = [
    {
      label: "Мой кабинет",
      href: "/cabinet",
      icon: "🏠",
      match: (path) => path === "/cabinet",
    },
    {
      label: "Как заказчик",
      href: "/client",
      icon: "📋",
      mode: "client",
      match: (path) => path.startsWith("/client"),
    },
    {
      label: "Как фрилансер",
      href: "/dashboard",
      icon: "💻",
      mode: "freelancer",
      match: (path) => path.startsWith("/dashboard"),
    },
    {
      label: "Переписки",
      href: "/messages",
      icon: "✉️",
      match: (path) => path.startsWith("/messages"),
    },
    {
      label: "Админ-панель",
      href: "/admin",
      icon: "🛡️",
      match: (path) => path === "/admin",
      highlight: true,
    },
  ];

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav className="sticky top-[calc(68px+1.5rem)] overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {items.map((item) => (
          <NavRow key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
