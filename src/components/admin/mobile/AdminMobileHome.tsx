"use client";

import { hasAdminPermission } from "@/lib/admin-permissions";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import type { AdminPermission } from "@/generated/prisma/client";
import type { AdminMobileBadges } from "@/lib/queries/admin-mobile-badges";
import Link from "next/link";

type AdminMobileHomeProps = {
  permissions: AdminPermission[];
  badges: AdminMobileBadges;
  stats: {
    users: number;
    projects: number;
    freelancers: number;
    clients: number;
  };
};

type QuickLink = {
  href: string;
  label: string;
  description: string;
  icon: string;
  badge?: number;
  permission?: Parameters<typeof hasAdminPermission>[1];
};

export function AdminMobileHome({
  permissions,
  badges,
  stats,
}: AdminMobileHomeProps) {
  const links: QuickLink[] = [
    {
      href: `${ADMIN_MOBILE_ROOT}/moderation`,
      label: "Модерация",
      description: "Жалобы, споры, проекты",
      icon: "🛡️",
      badge: badges.moderation,
      permission: "MODERATION",
    },
    {
      href: `${ADMIN_MOBILE_ROOT}/users`,
      label: "Пользователи",
      description: "Поиск, блокировка, удаление",
      icon: "👥",
      permission: "USERS",
    },
    {
      href: `${ADMIN_MOBILE_ROOT}/finance`,
      label: "Финансы",
      description: "Эскроу, платежи, комиссии",
      icon: "💰",
      badge: badges.finance,
      permission: "FINANCE",
    },
    {
      href: `${ADMIN_MOBILE_ROOT}/staff`,
      label: "Команда",
      description: "Администраторы и права",
      icon: "👤",
      permission: "STAFF_MANAGE",
    },
    {
      href: `${ADMIN_MOBILE_ROOT}/more`,
      label: "Ещё",
      description: "Режимы, кабинет, выход",
      icon: "⋯",
    },
  ];

  const visibleLinks = links.filter(
    (link) => !link.permission || hasAdminPermission(permissions, link.permission),
  );

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3">
        {[
          { label: "Пользователей", value: stats.users },
          { label: "Проектов", value: stats.projects },
          { label: "Заказчиков", value: stats.clients },
          { label: "Фрилансеров", value: stats.freelancers },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-zinc-700">Разделы</h2>
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm active:bg-zinc-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
              {link.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900">{link.label}</p>
              <p className="text-xs text-zinc-500">{link.description}</p>
            </div>
            {link.badge && link.badge > 0 ? (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                {link.badge > 9 ? "9+" : link.badge}
              </span>
            ) : (
              <span className="text-zinc-300">›</span>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}
