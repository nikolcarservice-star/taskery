import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";

import { FreelancerCard } from "@/components/FreelancerCard";

import { FreelancerFilters } from "@/components/FreelancerFilters";

import { getDictionary } from "@/lib/i18n/dictionary";

import { requireAppLocale } from "@/lib/i18n/locale-page";

import {

  buildFreelancerWhere,

  getFreelancerOrderBy,

  type FreelancerSearchParams,

} from "@/lib/queries/freelancers";

import { prisma } from "@/lib/prisma";

import { createMetadata } from "@/lib/metadata";

import { Suspense } from "react";



type FreelancersPageProps = {

  params: Promise<{ locale: string }>;

  searchParams: Promise<FreelancerSearchParams>;

};



export async function generateMetadata({ params }: FreelancersPageProps) {

  const locale = await requireAppLocale(params);

  const dict = await getDictionary(locale);



  return createMetadata({

    title: dict.meta.freelancers.title,

    description: dict.meta.freelancers.description,

    path: "/freelancers",

    locale,

    keywords: dict.meta.freelancers.keywords,

  });

}



export default async function FreelancersPage({

  params,

  searchParams,

}: FreelancersPageProps) {

  const locale = await requireAppLocale(params);

  const dict = await getDictionary(locale);

  const query = await searchParams;



  const [freelancers, skills] = await Promise.all([

    prisma.user.findMany({

      where: buildFreelancerWhere(query),

      orderBy: getFreelancerOrderBy(query.sort),

      include: {

        freelancerProfile: {

          include: {

            skills: { select: { name: true } },

          },

        },

        contractsAsFreelancer: {

          where: { status: "RELEASED" },

          select: { id: true },

        },

      },

    }),

    prisma.skill.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),

  ]);



  const items = freelancers.map((f) => ({

    id: f.id,

    name: f.name,

    avatar: f.avatar,

    rating: f.rating,

    bio: f.bio,

    subscriptionPlan: f.subscriptionPlan,

    featuredUntil: f.featuredUntil,

    freelancerProfile: f.freelancerProfile,

    completedProjects: f.contractsAsFreelancer.length,

  }));



  return (

    <AccountBrowsePage locale={locale} dict={dict} callbackUrl="/freelancers">

      <div className="max-w-2xl">

        <h1 className="account-mobile-title text-2xl font-bold text-zinc-900 sm:text-3xl">

          {dict.freelancers.h1}

        </h1>

        <p className="mt-2 text-sm text-zinc-600">{dict.freelancers.intro}</p>

      </div>



      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[280px_1fr] lg:gap-8">

        <Suspense

          fallback={

            <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />

          }

        >

          <FreelancerFilters skills={skills} />

        </Suspense>



        <section>

          <p className="mb-4 text-sm text-zinc-500">

            {dict.common.found}: {items.length}

          </p>

          {items.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">

              <p className="text-lg font-medium text-zinc-900">

                {dict.freelancers.emptyTitle}

              </p>

              <p className="mt-2 text-sm text-zinc-600">{dict.freelancers.emptyText}</p>

            </div>

          ) : (

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

              {items.map((freelancer) => (

                <FreelancerCard key={freelancer.id} freelancer={freelancer} locale={locale} />

              ))}

            </div>

          )}

        </section>

      </div>

    </AccountBrowsePage>

  );

}


