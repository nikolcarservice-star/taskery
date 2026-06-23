"use client";

import { CloseProjectButton } from "@/components/CloseProjectButton";
import { headerGhostButtonClass } from "@/components/HeaderShell";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import {
  formatBudget,
  projectStatusColors,
} from "@/lib/project-labels";
import Link from "next/link";

export type ClientProjectRow = {
  id: string;
  slug: string;
  title: string;
  currency: string;
  status: keyof ReturnType<typeof useDictionary>["labels"]["projectStatus"];
  budget: { toString(): string } | null;
  createdAt: Date;
  category: { name: string } | null;
  contract: {
    freelancer: { name: string | null };
  } | null;
  _count: { bids: number };
};

type MyProjectsTableProps = {
  projects: ClientProjectRow[];
};

export function MyProjectsTable({ projects }: MyProjectsTableProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const t = dict.tables.projects;
  const projectStatusLabels = dict.labels.projectStatus;

  if (projects.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
        <p className="text-lg font-medium text-zinc-900">{t.emptyTitle}</p>
        <p className="mt-2 text-sm text-zinc-600">{t.emptyBody}</p>
        <Link
          href={l("/client/projects/new")}
          className={`mt-6 inline-flex ${headerGhostButtonClass}`}
        >
          {t.createProject}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colProject}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colCategory}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colBudget}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colStatus}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colBids}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colFreelancer}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colCreated}
              </th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">
                {t.colActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-50">
                <td className="px-5 py-4">
                  <Link
                    href={l(`/projects/${project.slug}`)}
                    className="font-medium text-zinc-900 hover:text-indigo-600"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="px-5 py-4 text-zinc-600">
                  {project.category?.name ?? t.noFreelancer}
                </td>
                <td className="px-5 py-4 text-zinc-600">
                  {formatBudget(project.budget, project.currency, locale)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${projectStatusColors[project.status]}`}
                  >
                    {projectStatusLabels[project.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-600">{project._count.bids}</td>
                <td className="px-5 py-4 text-zinc-600">
                  {project.contract?.freelancer.name ?? t.noFreelancer}
                </td>
                <td className="px-5 py-4 text-zinc-600">
                  {project.createdAt.toLocaleDateString(locale)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={l(`/projects/${project.slug}`)}
                      className="text-indigo-600 hover:underline"
                    >
                      {t.view}
                    </Link>
                    <Link
                      href={l(`/client/projects/${project.slug}/edit`)}
                      className="text-zinc-600 hover:underline"
                    >
                      {t.edit}
                    </Link>
                    {project.status !== "CLOSED" && (
                      <CloseProjectButton projectId={project.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
