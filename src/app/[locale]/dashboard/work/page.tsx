import { MyTasksEmptyTrigger } from "@/components/MyTasksEmptyTrigger";
import { contractStatusColors } from "@/lib/contract-labels";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import {
  formatBudget,
  projectStatusColors,
} from "@/lib/project-labels";
import { getActiveFreelancerContracts } from "@/lib/freelancer-tasks";
import { requireFreelancer } from "@/lib/session";
import Link from "next/link";

type WorkPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: WorkPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.work;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard/work",
    locale,
    noIndex: true,
  });
}

export default async function MyWorkPage({ params }: WorkPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.work;
  const l = (path: string) => localizedPath(locale, path);
  const session = await requireFreelancer(l("/dashboard/work"));
  const contractStatusLabels = dict.labels.contractStatus;
  const projectStatusLabels = dict.labels.projectStatus;

  const activeContracts = await getActiveFreelancerContracts(session.user.id);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      {activeContracts.length === 0 ? (
        <>
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <p className="text-lg font-medium text-zinc-900">{p.emptyTitle}</p>
            <p className="mt-2 text-sm text-zinc-500">{p.emptyBody}</p>
          </div>
          <MyTasksEmptyTrigger />
        </>
      ) : (
        <div className="mt-8 grid gap-4">
          {activeContracts.map((contract) => (
            <article
              key={contract.id}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={l(`/projects/${contract.project.slug}`)}
                    className="text-lg font-semibold text-zinc-900 hover:text-indigo-600"
                  >
                    {contract.project.title}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">
                    {p.clientLabel}: {contract.client.name ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-zinc-900">
                    {formatBudget(contract.amount, contract.project.currency, locale)}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${contractStatusColors[contract.status]}`}
                  >
                    {contractStatusLabels[contract.status]}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${projectStatusColors[contract.project.status]}`}
                >
                  {projectStatusLabels[contract.project.status]}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
