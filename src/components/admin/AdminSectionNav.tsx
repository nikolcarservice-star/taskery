"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getAdminTabHrefForPlatform,
  getVisibleAdminTabs,
  type AdminTabDefinition,
} from "@/lib/admin-tabs";
import { getAdminCopy } from "@/lib/admin-i18n";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-tabs";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AppLocale } from "@/lib/i18n/types";

type AdminSectionNavProps = {
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  locale: AppLocale;
  platform: "desktop" | "mobile";
  className?: string;
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

export function AdminSectionNav({
  permissions,
  badges,
  locale,
  platform,
  className = "",
}: AdminSectionNavProps) {
  const pathname = usePathname();
  const tabs = getVisibleAdminTabs(permissions);
  const copy = getAdminCopy(locale);
  const isMobile = platform === "mobile";

  return (
    <aside
      className={`flex shrink-0 flex-col ${
        isMobile ? "w-[9.5rem] sm:w-56" : "w-full lg:w-64"
      } ${className}`}
    >
      <div
        className={`rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm sm:p-3 ${
          isMobile ? "" : "lg:sticky lg:top-6"
        }`}
      >
        <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:px-3 sm:pb-2">
          {copy.sections}
        </p>
        <nav aria-label={copy.navAria} className="space-y-0.5 sm:space-y-1">
          {tabs.map((tab) => {
            const href = getAdminTabHrefForPlatform(tab, platform);
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            const badge = tabBadge(tab, badges);
            const label = copy.tabs[tab.id].label;

            return (
              <Link
                key={tab.id}
                href={href}
                className={`flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-medium transition-colors sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm ${
                  active
                    ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <span className="text-sm leading-none sm:text-base" aria-hidden="true">
                  {tab.icon}
                </span>
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {badge !== undefined && (
                  <span
                    className={`inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold leading-4 sm:min-w-5 sm:px-1.5 sm:text-[10px] sm:leading-5 ${
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

        <div className="mt-3 border-t border-zinc-100 pt-3 sm:mt-4 sm:pt-4">
          {isMobile ? (
            <Link
              href="/admin/overview?desktop=1"
              className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs text-zinc-600 hover:bg-zinc-50 sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              <span aria-hidden="true">🖥️</span>
              <span className="truncate">{copy.desktopVersion}</span>
            </Link>
          ) : (
            <Link
              href={`${ADMIN_MOBILE_ROOT}?mobile=1`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <span aria-hidden="true">📱</span>
              <span>{copy.mobileVersion}</span>
            </Link>
          )}
          <Link
            href="/cabinet"
            className={`mt-0.5 flex items-center gap-2 rounded-xl px-2 py-2 text-xs text-zinc-600 hover:bg-zinc-50 sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm ${
              isMobile ? "" : "mt-1"
            }`}
          >
            <span aria-hidden="true">↩</span>
            <span className="truncate">{copy.backToCabinet}</span>
          </Link>
          {isMobile && (
            <Link
              href={`${ADMIN_MOBILE_ROOT}/more`}
              className="mt-0.5 flex items-center gap-2 rounded-xl px-2 py-2 text-xs text-zinc-600 hover:bg-zinc-50 sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              <span aria-hidden="true">⋯</span>
              <span className="truncate">{copy.moreSettings}</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
