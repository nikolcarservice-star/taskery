import { AdminLoginForm } from "@/components/AdminLoginForm";
import { GuestHeader } from "@/components/GuestHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import Link from "next/link";

export function AdminLoginView({ locale }: { locale: AppLocale }) {
  const l = getAdminCopy(locale).panels.login;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <GuestHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <span className="inline-flex w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
          {l.badge}
        </span>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">{l.title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{l.description}</p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AdminLoginForm locale={locale} />
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-900">{l.devAccount}</p>
            <p className="mt-2 font-mono text-xs text-indigo-800">
              admin@taskery.local · admin123
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600">
          <Link href="/" className="text-blue-600 underline hover:text-blue-700">
            {l.backToSite}
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
