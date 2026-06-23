import { AdminLoginForm } from "@/components/AdminLoginForm";
import { GuestHeader } from "@/components/GuestHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export function AdminLoginView() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <GuestHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <span className="inline-flex w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
          Администрирование
        </span>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">Вход администратора</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Отдельный вход для главного администратора платформы. После входа откроется
          личный кабинет.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AdminLoginForm />
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-900">Dev-аккаунт</p>
            <p className="mt-2 font-mono text-xs text-indigo-800">
              admin@taskery.local · admin123
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600">
          <Link href="/" className="text-blue-600 underline hover:text-blue-700">
            Вернуться на сайт
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
