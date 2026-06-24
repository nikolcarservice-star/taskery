import { AdminModeLink } from "@/components/AdminModeLink";
import { getAdminCopy } from "@/lib/admin-i18n";
import { getLocale } from "@/lib/i18n/server";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

const cardClass =
  "flex min-h-[4.5rem] flex-col justify-center rounded-2xl border px-4 py-4 transition-colors active:scale-[0.99] sm:px-5";

export async function generateMetadata() {
  const locale = await getLocale();
  const home = getAdminCopy(locale).panels.cabinetHome;

  return createMetadata({
    title: home.metaTitle,
    description: home.metaDescription,
    path: "/cabinet",
    noIndex: true,
  });
}

export default async function AdminCabinetPage() {
  const locale = await getLocale();
  const home = getAdminCopy(locale).panels.cabinetHome;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">{home.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{home.description}</p>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-4">
        <Link
          href="/admin/mobile"
          className={`${cardClass} order-first border-red-200 bg-red-50 hover:bg-red-100 sm:col-span-2`}
        >
          <p className="font-semibold text-red-900">{home.panelTitle}</p>
          <p className="mt-1 text-sm text-red-700/80">{home.panelDescription}</p>
        </Link>

        <AdminModeLink
          mode="client"
          href="/client"
          className={`${cardClass} border-indigo-200 bg-indigo-50 hover:bg-indigo-100`}
        >
          <p className="font-semibold text-indigo-900">{home.asClient}</p>
          <p className="mt-1 text-sm text-indigo-700/80">{home.asClientDesc}</p>
        </AdminModeLink>

        <AdminModeLink
          mode="freelancer"
          href="/dashboard"
          className={`${cardClass} border-emerald-200 bg-emerald-50 hover:bg-emerald-100`}
        >
          <p className="font-semibold text-emerald-900">{home.asFreelancer}</p>
          <p className="mt-1 text-sm text-emerald-700/80">{home.asFreelancerDesc}</p>
        </AdminModeLink>

        <AdminModeLink
          mode="client"
          href="/messages"
          className={`${cardClass} border-zinc-200 bg-zinc-50 hover:bg-zinc-100`}
        >
          <p className="font-semibold text-zinc-900">{home.messages}</p>
          <p className="mt-1 text-sm text-zinc-600">{home.messagesDesc}</p>
        </AdminModeLink>

        <AdminModeLink
          mode="client"
          href="/client/finances"
          className={`${cardClass} border-zinc-200 bg-zinc-50 hover:bg-zinc-100`}
        >
          <p className="font-semibold text-zinc-900">{home.finances}</p>
          <p className="mt-1 text-sm text-zinc-600">{home.financesDesc}</p>
        </AdminModeLink>
      </div>
    </div>
  );
}
