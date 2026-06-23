import { contractStatusColors } from "@/lib/contract-labels";
import { getActiveClientContracts } from "@/lib/client-projects";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import {
  formatBudget,
  projectStatusColors,
} from "@/lib/project-labels";
import { requireClient } from "@/lib/session";
import Link from "next/link";

type ClientWorkPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ClientWorkPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.work;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/client/work",
    locale,
    noIndex: true,
  });
}

export default async function ClientWorkPage({ params }: ClientWorkPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.work;
  const l = (path: string) => localizedPath(locale, path);
  const session = await requireClient(l("/client/work"));
  const contractStatusLabels = dict.labels.contractStatus;
  const projectStatusLabels = dict.labels.projectStatus;

  const activeContracts = await getActiveClientContracts(session.user.id);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      {activeContracts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <p className="text-lg font-medium text-zinc-900">{p.emptyTitle}</p>
          <p className="mt-2 text-sm text-zinc-500">{p.emptyBody}</p>
          <Link
            href={l("/client/projects")}
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {p.goProjects}
          </Link>
        </div>
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
                    {p.freelancerLabel}:{" "}
                    <Link
                      href={l(`/freelancers/${contract.freelancer.id}`)}
                      className="text-indigo-600 hover:underline"
                    >
                      {contract.freelancer.name ?? "—"}
                    </Link>
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
