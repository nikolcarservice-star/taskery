import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";

import { PageBackNav } from "@/components/PageBackNav";

import { ProjectCard } from "@/components/ProjectCard";

import { ProjectFilters } from "@/components/ProjectFilters";

import { getDictionary } from "@/lib/i18n/dictionary";

import { requireAppLocale } from "@/lib/i18n/locale-page";

import { createMetadata } from "@/lib/metadata";

import {

  buildOpenProjectsWhere,

  getProjectOrderBy,

  type ProjectSearchParams,

} from "@/lib/queries/projects";

import { prisma } from "@/lib/prisma";

import { Suspense } from "react";



type ProjectsPageProps = {

  params: Promise<{ locale: string }>;

  searchParams: Promise<ProjectSearchParams>;

};



export async function generateMetadata({ params }: ProjectsPageProps) {

  const locale = await requireAppLocale(params);

  const dict = await getDictionary(locale);



  return createMetadata({

    title: dict.meta.projects.title,

    description: dict.meta.projects.description,

    path: "/projects",

    locale,

    keywords: dict.meta.projects.keywords,

  });

}



export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {

  const locale = await requireAppLocale(params);

  const dict = await getDictionary(locale);

  const query = await searchParams;

  const where = buildOpenProjectsWhere(query);



  const [projects, categories] = await Promise.all([

    prisma.project.findMany({

      where,

      orderBy: getProjectOrderBy(query.sort),

      include: {

        category: { select: { name: true } },

        _count: { select: { bids: true } },

      },

    }),

    prisma.category.findMany({

      orderBy: { name: "asc" },

      select: { id: true, name: true },

    }),

  ]);



  const hasFilters = Boolean(

    query.q || query.category || query.minBudget || query.maxBudget,

  );



  return (

    <AccountBrowsePage locale={locale} dict={dict} callbackUrl="/projects">

      <div className="max-w-2xl">

        <h1 className="account-mobile-title text-2xl font-bold text-zinc-900 sm:text-3xl">

          {dict.projects.h1}

        </h1>

        <p className="mt-2 text-sm text-zinc-600">{dict.projects.intro}</p>

      </div>



      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[280px_1fr] lg:gap-8">

        <Suspense

          fallback={

            <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />

          }

        >

          <ProjectFilters categories={categories} />

        </Suspense>



        <section>

          <p className="mb-4 text-sm text-zinc-500">

            {dict.common.found}: {projects.length}

            {hasFilters ? ` (${dict.common.foundFiltered})` : ""}

          </p>



          {projects.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">

              <p className="text-lg font-medium text-zinc-900">

                {dict.projects.emptyTitle}

              </p>

              <p className="mt-2 text-sm text-zinc-600">{dict.projects.emptyText}</p>

            </div>

          ) : (

            <div className="grid gap-3 sm:gap-4">

              {projects.map((project) => (

                <ProjectCard key={project.id} project={project} locale={locale} />

              ))}

            </div>

          )}

        </section>

      </div>

    </AccountBrowsePage>

  );

}


