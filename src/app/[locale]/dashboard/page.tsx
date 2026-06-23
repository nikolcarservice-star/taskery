import { FreelancerSettings } from "@/components/FreelancerSettings";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { requireFreelancer } from "@/lib/session";
import Link from "next/link";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DashboardPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.overview;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard",
    locale,
    noIndex: true,
  });
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.overview;
  const l = (path: string) => localizedPath(locale, path);

  await requireFreelancer(l("/dashboard"));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8 lg:rounded-xl">
      <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <Link
        href={l("/projects")}
        className="mt-6 flex items-center justify-between rounded-2xl bg-indigo-600 px-5 py-4 text-white shadow-sm transition-colors hover:bg-indigo-700 lg:hidden"
      >
        <span>
          <p className="font-semibold">{p.findProject.title}</p>
          <p className="mt-1 text-sm text-indigo-100">{p.findProject.desc}</p>
        </span>
        <span aria-hidden className="text-lg">→</span>
      </Link>

      <div className="mt-8 hidden gap-4 lg:grid lg:grid-cols-2">
        <Link
          href={l("/projects")}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4 transition-colors hover:bg-indigo-100"
        >
          <p className="font-semibold text-indigo-900">{p.findProject.title}</p>
          <p className="mt-1 text-sm text-indigo-700/80">{p.findProject.desc}</p>
        </Link>
        <Link
          href={l("/dashboard/work")}
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 transition-colors hover:bg-zinc-100"
        >
          <p className="font-semibold text-zinc-900">{p.myTasks.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{p.myTasks.desc}</p>
        </Link>
        <Link
          href={l("/dashboard/bids")}
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 transition-colors hover:bg-zinc-100"
        >
          <p className="font-semibold text-zinc-900">{p.myBids.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{p.myBids.desc}</p>
        </Link>
        <Link
          href={l("/messages")}
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 transition-colors hover:bg-zinc-100"
        >
          <p className="font-semibold text-zinc-900">{p.messages.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{p.messages.desc}</p>
        </Link>
        <Link
          href={l("/dashboard/finances")}
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 transition-colors hover:bg-zinc-100"
        >
          <p className="font-semibold text-zinc-900">{p.finances.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{p.finances.desc}</p>
        </Link>
        <Link
          href={l("/dashboard/portfolio")}
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 transition-colors hover:bg-zinc-100"
        >
          <p className="font-semibold text-zinc-900">{p.portfolio.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{p.portfolio.desc}</p>
        </Link>
      </div>
    </div>
  );
}
