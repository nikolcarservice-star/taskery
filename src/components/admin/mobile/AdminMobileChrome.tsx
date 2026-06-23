"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_MOBILE_ROOT,
  getAdminMobilePageTitle,
  getVisibleAdminMobileTabs,
  type AdminMobileTabKey,
} from "@/lib/admin-mobile-routes";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";

export const ADMIN_MOBILE_NAV_HEIGHT =
  "calc(3.75rem + env(safe-area-inset-bottom, 0px))";

type AdminMobileBottomNavProps = {
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
};

function tabBadge(
  key: AdminMobileTabKey,
  badges: AdminMobileBadges,
): number | undefined {
  if (key === "moderation" && badges.moderation > 0) return badges.moderation;
  if (key === "finance" && badges.finance > 0) return badges.finance;
  return undefined;
}

export function AdminMobileBottomNav({
  permissions,
  badges,
}: AdminMobileBottomNavProps) {
  const pathname = usePathname();
  const tabs = getVisibleAdminMobileTabs(permissions);
  const cols = tabs.length;

  return (
    <nav
      aria-label="Навигация админ-панели"
      className="admin-mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/95 shadow-[0_-8px_32px_rgba(15,23,42,0.1)] backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg justify-center pt-1">
        <span className="h-1 w-10 rounded-full bg-zinc-200" />
      </div>
      <ul
        className="mx-auto grid max-w-lg px-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const active =
            tab.href === ADMIN_MOBILE_ROOT
              ? pathname === ADMIN_MOBILE_ROOT
              : pathname.startsWith(tab.href);
          const badge = tabBadge(tab.key, badges);

          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                className="relative flex min-h-[3.5rem] flex-col items-center justify-center rounded-xl px-1 py-1 active:bg-zinc-100"
              >
                {active ? (
                  <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-red-600" />
                ) : null}
                <span className="relative text-lg leading-none">
                  {tab.icon}
                  {badge ? (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`mt-0.5 max-w-full truncate text-[10px] font-medium ${
                    active ? "text-red-600" : "text-zinc-500"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type AdminMobileHeaderProps = {
  adminName: string | null;
};

export function AdminMobileHeader({ adminName }: AdminMobileHeaderProps) {
  const pathname = usePathname();
  const title = getAdminMobilePageTitle(pathname);

  return (
    <header className="admin-mobile-header sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
            Taskery Admin
          </p>
          <h1 className="truncate text-lg font-bold text-zinc-900">{title}</h1>
        </div>
        <div className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-100">
          {adminName ?? "Админ"}
        </div>
      </div>
    </header>
  );
}
