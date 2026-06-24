"use client";

import { AdminModeLink } from "@/components/AdminModeLink";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { ADMIN_MOBILE_ROOT } from "@/lib/admin-mobile-routes";
import type { AdminPermission } from "@/generated/prisma/client";
import Link from "next/link";
import { signOut } from "next-auth/react";

type AdminMobileMoreProps = {
  permissions: AdminPermission[];
  adminEmail: string;
};

export function AdminMobileMore({ permissions, adminEmail }: AdminMobileMoreProps) {
  const canManageStaff = hasAdminPermission(permissions, "STAFF_MANAGE");

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="text-xs text-zinc-500">Вход выполнен как</p>
        <p className="mt-1 font-medium text-zinc-900">{adminEmail}</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
          Режим работы
        </h2>
        <div className="divide-y divide-zinc-100">
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
        </div>
      </section>

      {canManageStaff && (
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
            Управление
          </h2>
          <Link
            href={`${ADMIN_MOBILE_ROOT}/broadcast`}
            className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">📣</span>
              Рассылка уведомлений
            </span>
            <span className="text-zinc-400">›</span>
          </Link>
          <Link
            href={`${ADMIN_MOBILE_ROOT}/catalog`}
            className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">📚</span>
              Каталог категорий и навыков
            </span>
            <span className="text-zinc-400">›</span>
          </Link>
          <Link
            href={`${ADMIN_MOBILE_ROOT}/cms`}
            className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">📄</span>
              Статические страницы (CMS)
            </span>
            <span className="text-zinc-400">›</span>
          </Link>
          <Link
            href={`${ADMIN_MOBILE_ROOT}/staff`}
            className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">👤</span>
              Команда администраторов
            </span>
            <span className="text-zinc-400">›</span>
          </Link>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
          Интерфейс
        </h2>
        <Link
          href="/admin?desktop=1"
          className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-zinc-800 active:bg-zinc-50"
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">🖥️</span>
            Полная версия панели
          </span>
          <span className="text-zinc-400">›</span>
        </Link>
      </section>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin" })}
        className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3.5 text-sm font-semibold text-red-700 shadow-sm active:bg-red-50"
      >
        Выйти
      </button>
    </div>
  );
}
