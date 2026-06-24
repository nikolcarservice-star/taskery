import { AdminModeLink } from "@/components/AdminModeLink";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Кабинет администратора",
  description: "Личный кабинет главного администратора Taskery",
  path: "/cabinet",
  noIndex: true,
});

const cardClass =
  "flex min-h-[4.5rem] flex-col justify-center rounded-2xl border px-4 py-4 transition-colors active:scale-[0.99] sm:px-5";

export default function AdminCabinetPage() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
        Кабинет администратора
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Выберите режим работы на платформе. Выбранный режим сохранится в меню и
        шапке сайта.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-4">
        <Link
          href="/admin/mobile"
          className={`${cardClass} order-first border-red-200 bg-red-50 hover:bg-red-100 sm:col-span-2`}
        >
          <p className="font-semibold text-red-900">Админ-панель</p>
          <p className="mt-1 text-sm text-red-700/80">
            Модерация, пользователи, финансы и управление платформой.
          </p>
        </Link>

        <AdminModeLink
          mode="client"
          href="/client"
          className={`${cardClass} border-indigo-200 bg-indigo-50 hover:bg-indigo-100`}
        >
          <p className="font-semibold text-indigo-900">Работа как заказчик</p>
          <p className="mt-1 text-sm text-indigo-700/80">
            Создавайте проекты, выбирайте исполнителей и ведите переписку.
          </p>
        </AdminModeLink>

        <AdminModeLink
          mode="freelancer"
          href="/dashboard"
          className={`${cardClass} border-emerald-200 bg-emerald-50 hover:bg-emerald-100`}
        >
          <p className="font-semibold text-emerald-900">Работа как фрилансер</p>
          <p className="mt-1 text-sm text-emerald-700/80">
            Откликайтесь на проекты, выполняйте задачи и ведите портфолио.
          </p>
        </AdminModeLink>

        <AdminModeLink
          mode="client"
          href="/messages"
          className={`${cardClass} border-zinc-200 bg-zinc-50 hover:bg-zinc-100`}
        >
          <p className="font-semibold text-zinc-900">Переписки</p>
          <p className="mt-1 text-sm text-zinc-600">
            Все сообщения по проектам в одном месте.
          </p>
        </AdminModeLink>

        <AdminModeLink
          mode="client"
          href="/client/finances"
          className={`${cardClass} border-zinc-200 bg-zinc-50 hover:bg-zinc-100`}
        >
          <p className="font-semibold text-zinc-900">Финансы</p>
          <p className="mt-1 text-sm text-zinc-600">
            Баланс, резервы и история операций.
          </p>
        </AdminModeLink>
      </div>
    </div>
  );
}
