"use client";

import { AdminAnalyticsPanel } from "@/components/AdminAnalyticsPanel";
import { AdminTelegramSettings } from "@/components/admin/AdminTelegramSettings";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import {
  getAdminTabHrefForPlatform,
  getVisibleAdminTabs,
  type AdminTabKey,
} from "@/lib/admin-tabs";
import { getAdminCopy, localizeAdminTab } from "@/lib/admin-i18n";
import { hasAdminPermission } from "@/lib/admin-permissions";
import type { AdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import type { AppLocale } from "@/lib/i18n/types";
import Link from "next/link";

type AdminOverviewSectionProps = {
  stats: {
    users: number;
    projects: number;
    freelancers: number;
    clients: number;
  };
  permissions: AdminPermission[];
  analytics: AdminAnalyticsOverview | null;
  badges: AdminMobileBadges;
  locale: AppLocale;
  platform?: "desktop" | "mobile";
};

function overviewBadge(tab: AdminTabKey, badges: AdminMobileBadges): number {
  switch (tab) {
    case "moderation":
      return badges.moderation;
    case "users":
      return badges.verification;
    case "finance":
      return badges.withdrawals || badges.finance;
    default:
      return 0;
  }
}

export function AdminOverviewSection({
  stats,
  permissions,
  analytics,
  badges,
  locale,
  platform = "desktop",
}: AdminOverviewSectionProps) {
  const copy = getAdminCopy(locale);
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");
  const visibleTabs = getVisibleAdminTabs(permissions)
    .filter((tab) => tab.id !== "overview")
    .map((tab) => localizeAdminTab(tab, locale));

  const hasAnyPermission =
    hasAdminPermission(permissions, "MODERATION") ||
    hasAdminPermission(permissions, "STAFF_MANAGE") ||
    hasAdminPermission(permissions, "USERS") ||
    hasAdminPermission(permissions, "FINANCE");

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: copy.overview.statsUsers, value: stats.users },
          { label: copy.overview.statsClients, value: stats.clients },
          { label: copy.overview.statsFreelancers, value: stats.freelancers },
          { label: copy.overview.statsProjects, value: stats.projects },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {visibleTabs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-900">
            {copy.overview.quickAccess}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {visibleTabs.map((tab) => {
              const count = overviewBadge(tab.id, badges);
              return (
                <Link
                  key={tab.id}
                  href={getAdminTabHrefForPlatform(tab, platform)}
                  className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-red-200 hover:bg-red-50/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg group-hover:bg-red-100">
                    {tab.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900">{tab.label}</p>
                      {count > 0 && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{tab.description}</p>
                  </div>
                  <span className="text-zinc-300 group-hover:text-red-400">›</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">{copy.telegram.title}</h2>
        <div className="mt-3">
          <AdminTelegramSettings locale={locale} />
        </div>
      </section>

      {canViewFinance && analytics && (
        <AdminAnalyticsPanel analytics={analytics} locale={locale} />
      )}

      {!hasAnyPermission && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {copy.overview.noPermissions}
        </section>
      )}
    </div>
  );
}
