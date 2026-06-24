"use client";

import { AdminModeLink } from "@/components/AdminModeLink";
import Link from "next/link";
import { signOut } from "next-auth/react";

type AdminMobileMoreProps = {
  adminEmail: string;
};

export function AdminMobileMore({ adminEmail }: AdminMobileMoreProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
        <p className="text-xs text-zinc-500">Вход выполнен как</p>
        <p className="mt-1 font-medium text-zinc-900">{adminEmail}</p>
      </section>

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
