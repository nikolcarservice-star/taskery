"use client";

import { AdminAnalyticsPanel } from "@/components/AdminAnalyticsPanel";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import {
  getAdminTabHrefForPlatform,
  getVisibleAdminTabs,
  type AdminTabKey,
} from "@/lib/admin-tabs";
import { hasAdminPermission } from "@/lib/admin-permissions";
import type { AdminAnalyticsOverview } from "@/lib/queries/admin-analytics";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
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
  platform = "desktop",
}: AdminOverviewSectionProps) {
  const canViewFinance = hasAdminPermission(permissions, "FINANCE");
  const visibleTabs = getVisibleAdminTabs(permissions).filter(
    (tab) => tab.id !== "overview",
  );

  const hasAnyPermission =
    hasAdminPermission(permissions, "MODERATION") ||
    hasAdminPermission(permissions, "STAFF_MANAGE") ||
    hasAdminPermission(permissions, "USERS") ||
    hasAdminPermission(permissions, "FINANCE");

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Пользователей", value: stats.users },
          { label: "Заказчиков", value: stats.clients },
          { label: "Фрилансеров", value: stats.freelancers },
          { label: "Проектов", value: stats.projects },
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
          <h2 className="text-sm font-semibold text-zinc-900">Быстрый доступ</h2>
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

      {canViewFinance && analytics && <AdminAnalyticsPanel analytics={analytics} />}

      {!hasAnyPermission && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          У вашего аккаунта нет назначенных функций. Обратитесь к
          супер-администратору.
        </section>
      )}
    </div>
  );
}
