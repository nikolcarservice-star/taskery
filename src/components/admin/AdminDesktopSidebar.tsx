"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_TABS,
  getVisibleAdminTabs,
  type AdminTabDefinition,
} from "@/lib/admin-tabs";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";

type AdminDesktopSidebarProps = {
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
};

function tabBadge(
  tab: AdminTabDefinition,
  badges: AdminMobileBadges,
): number | undefined {
  switch (tab.id) {
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

export function AdminDesktopSidebar({
  permissions,
  badges,
}: AdminDesktopSidebarProps) {
  const pathname = usePathname();
  const tabs = getVisibleAdminTabs(permissions);

  return (
    <aside className="flex w-full shrink-0 flex-col lg:w-64">
      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm lg:sticky lg:top-6">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Разделы
        </p>
        <nav aria-label="Навигация админ-панели" className="space-y-1">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const badge = tabBadge(tab, badges);

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {tab.icon}
                </span>
                <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                {badge !== undefined && (
                  <span
                    className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-5 ${
                      active ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-800"
                    }`}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-zinc-100 pt-4">
          <Link
            href={`${ADMIN_MOBILE_ROOT}?mobile=1`}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <span aria-hidden="true">📱</span>
            <span>Мобильная версия</span>
          </Link>
          <Link
            href="/cabinet"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <span aria-hidden="true">↩</span>
            <span>В кабинет</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
