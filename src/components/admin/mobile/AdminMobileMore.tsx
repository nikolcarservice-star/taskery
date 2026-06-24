"use client";

import { AdminModeLink } from "@/components/AdminModeLink";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { getAdminTabHrefForPlatform, getVisibleAdminTabs } from "@/lib/admin-tabs";
import type { AdminPermission } from "@/generated/prisma/client";

type AdminMobileMoreProps = {
  adminEmail: string;
  permissions: AdminPermission[];
};

export function AdminMobileMore({ adminEmail, permissions }: AdminMobileMoreProps) {
  const extraTabs = getVisibleAdminTabs(permissions).filter((tab) =>
    ["platform", "team"].includes(tab.id),
  );

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
        <p className="text-xs text-zinc-500">Вход выполнен как</p>
        <p className="mt-1 font-medium text-zinc-900">{adminEmail}</p>
      </section>

      {extraTabs.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
            Разделы
          </h2>
          <div className="divide-y divide-zinc-100">
            {extraTabs.map((tab) => (
              <Link
                key={tab.id}
                href={getAdminTabHrefForPlatform(tab, "mobile")}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="min-w-0 flex-1">
                  <p>{tab.label}</p>
                  <p className="text-xs font-normal text-zinc-500">{tab.description}</p>
                </div>
                <span className="text-zinc-300">›</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-zinc-200">
        <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
          Режим работы
        </h2>
        <div className="divide-y divide-zinc-100 bg-white">
          <AdminModeLink
            mode="client"
            href="/client"
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="text-lg">📋</span>
            Работа как заказчик
          </AdminModeLink>
          <AdminModeLink
            mode="freelancer"
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="text-lg">💻</span>
            Работа как фрилансер
          </AdminModeLink>
          <Link
            href="/cabinet"
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="text-lg">🏠</span>
            Кабинет администратора
          </Link>
          <Link
            href="/admin/overview?desktop=1"
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="text-lg">🖥️</span>
            Полная версия
          </Link>
        </div>
      </section>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin" })}
        className="w-full rounded-xl border border-red-200 bg-white px-4 py-3.5 text-sm font-semibold text-red-700 shadow-sm active:bg-red-50"
      >
        Выйти
      </button>
    </div>
  );
}
