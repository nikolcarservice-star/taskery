"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_MOBILE_ROOT,
  getAdminTabHrefForPlatform,
  getVisibleAdminTabs,
  type AdminTabKey,
} from "@/lib/admin-tabs";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AppLocale } from "@/lib/i18n/types";

export const ADMIN_MOBILE_BOTTOM_NAV_HEIGHT =
  "calc(3.75rem + env(safe-area-inset-bottom, 0px))";

const PRIMARY_TAB_IDS: AdminTabKey[] = [
  "overview",
  "moderation",
  "users",
  "finance",
];

type AdminMobileBottomNavProps = {
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  locale: AppLocale;
};

function tabBadge(
  tabId: AdminTabKey,
  badges: AdminMobileBadges,
): number | undefined {
  switch (tabId) {
    case "moderation":
      return badges.moderation > 0 ? badges.moderation : undefined;
    case "users":
      return badges.verification > 0 ? badges.verification : undefined;
    case "finance":
      return badges.withdrawals > 0
        ? badges.withdrawals
        : badges.finance > 0
          ? badges.finance
          : undefined;
    default:
      return undefined;
  }
}

function isMoreRoute(pathname: string): boolean {
  return (
    pathname === `${ADMIN_MOBILE_ROOT}/more` ||
    pathname.startsWith(`${ADMIN_MOBILE_ROOT}/platform`) ||
    pathname.startsWith(`${ADMIN_MOBILE_ROOT}/team`)
  );
}

export function AdminMobileBottomNav({
  permissions,
  badges,
  locale,
}: AdminMobileBottomNavProps) {
  const pathname = usePathname();
  const copy = getAdminCopy(locale);
  const visibleTabs = getVisibleAdminTabs(permissions);

  const navTabs = PRIMARY_TAB_IDS.map((id) =>
    visibleTabs.find((tab) => tab.id === id),
  ).filter((tab): tab is NonNullable<typeof tab> => tab !== undefined);

  const cols = navTabs.length + 1;

  return (
    <nav
      aria-label={copy.navAria}
      className="admin-mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/95 shadow-[0_-8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul
        className="mx-auto grid max-w-lg"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {navTabs.map((tab) => {
          const href = getAdminTabHrefForPlatform(tab, "mobile");
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          const badge = tabBadge(tab.id, badges);
          const label = copy.tabs[tab.id].label;

          return (
            <li key={tab.id}>
              <Link
                href={href}
                className={`relative flex min-h-[3.5rem] flex-col items-center justify-center px-1 py-1.5 transition-colors active:bg-zinc-100 ${
                  active ? "text-red-600" : "text-zinc-500"
                }`}
              >
                {active ? (
                  <span className="absolute left-1/2 top-0 h-0.5 w-7 -translate-x-1/2 rounded-full bg-red-600" />
                ) : null}
                <span className="relative text-lg leading-none" aria-hidden="true">
                  {tab.icon}
                </span>
                {badge !== undefined ? (
                  <span className="absolute right-[calc(50%-1.25rem)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
                <span
                  className={`mt-0.5 max-w-full truncate text-[10px] font-medium ${
                    active ? "text-red-600" : "text-zinc-500"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}

        <li>
          <Link
            href={`${ADMIN_MOBILE_ROOT}/more`}
            className={`relative flex min-h-[3.5rem] flex-col items-center justify-center px-1 py-1.5 transition-colors active:bg-zinc-100 ${
              isMoreRoute(pathname) ? "text-red-600" : "text-zinc-500"
            }`}
          >
            {isMoreRoute(pathname) ? (
              <span className="absolute left-1/2 top-0 h-0.5 w-7 -translate-x-1/2 rounded-full bg-red-600" />
            ) : null}
            <span className="text-lg leading-none" aria-hidden="true">
              ⋯
            </span>
            <span
              className={`mt-0.5 max-w-full truncate text-[10px] font-medium ${
                isMoreRoute(pathname) ? "text-red-600" : "text-zinc-500"
              }`}
            >
              {copy.moreSettings}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
