"use client";

import { FeaturedBadge } from "@/components/FeaturedBadge";
import { ProjectReportFlag } from "@/components/ProjectReportBar";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { AppLocale } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import { formatBudget } from "@/lib/project-labels";
import { getProjectPath, isFeaturedActive } from "@/lib/slug";
import Link from "next/link";

type ProjectCardProps = {
  locale?: AppLocale;
  project: {
    id: string;
    slug: string;
    title: string;
    description: string;
    budget: { toString(): string } | null;
    currency: string;
    createdAt: Date;
    isFeatured: boolean;
    featuredUntil: Date | null;
    reportCount?: number;
    underpricedReportCount?: number;
    moderationHot?: boolean;
    _count: { bids: number };
    category: { name: string } | null;
  };
};

export function ProjectCard({ project, locale = "ru" }: ProjectCardProps) {
  const dict = useDictionary();
  const excerpt =
    project.description.length > 160
      ? `${project.description.slice(0, 160).trim()}…`
      : project.description;

  const featured = isFeaturedActive(project.featuredUntil, project.isFeatured);

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
        featured ? "border-blue-200 ring-1 ring-blue-100" : "border-zinc-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {project.category && (
              <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                {project.category.name}
              </span>
            )}
            {featured && <FeaturedBadge />}
            <ProjectReportFlag
              reportCount={project.reportCount ?? 0}
              underpricedReportCount={project.underpricedReportCount ?? 0}
              moderationHot={project.moderationHot ?? false}
            />
          </div>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900">
            <Link
              href={localizedPath(locale, getProjectPath(project))}
              className="hover:text-blue-600"
            >
              {project.title}
            </Link>
          </h2>
        </div>
        <p className="text-sm font-semibold text-zinc-900">
          {formatBudget(project.budget, project.currency)}
        </p>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
        {excerpt}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          {project._count.bids}{" "}
          {project._count.bids === 1
            ? dict.catalog.projectCard.bidsOne
            : project._count.bids < 5
              ? dict.catalog.projectCard.bidsFew
              : dict.catalog.projectCard.bidsMany}
        </span>
        <span>{project.createdAt.toLocaleDateString(locale)}</span>
      </div>
    </article>
  );
}
