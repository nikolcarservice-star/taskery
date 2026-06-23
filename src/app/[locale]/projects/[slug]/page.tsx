import { BidForm, BidLoginPrompt } from "@/components/BidForm";

import { FeaturedBadge } from "@/components/FeaturedBadge";

import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";

import { JsonLd, breadcrumbJsonLd, jobPostingJsonLd } from "@/components/JsonLd";

import { ProjectReviewsSection } from "@/components/ProjectReviewsSection";

import {

  ContractPanel,

  FreelancerContractPanel,

} from "@/components/ContractPanel";

import { MarkdownContent } from "@/components/MarkdownContent";

import {
  FreelancerBidStatus,
  ProjectBidList,
} from "@/components/ProjectBidList";

import { ProjectBidCta } from "@/components/project/ProjectBidCta";

import { ProjectDetailTabs } from "@/components/project/ProjectDetailTabs";
import { ProjectDiscussionPanel } from "@/components/ProjectDiscussionPanel";

import { ProjectProgressBar } from "@/components/project/ProjectProgressBar";
import { ProjectReportBar } from "@/components/ProjectReportBar";
import { hasUserReportedProject } from "@/lib/report-stats";

import { ProjectSidebar } from "@/components/project/ProjectSidebar";

import { formatBudget, projectStatusColors } from "@/lib/project-labels";

import { auth } from "@/lib/auth";
import { getAdminWorkMode } from "@/lib/admin-work-mode";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";

import { createMetadata } from "@/lib/metadata";
import { getClientOrderStats } from "@/lib/client-stats";
import { markBidMessageNotificationsReadForProject } from "@/lib/notifications";

import { prisma } from "@/lib/prisma";
import { getProjectDetailById } from "@/lib/queries/project-detail";
import { resolveProjectSlug } from "@/lib/queries/project-lookup";
import { shouldWarnExternalLinks } from "@/lib/moderation/message-guard";

import { absoluteUrl } from "@/lib/seo";

import { isFeaturedActive } from "@/lib/slug";
import { stripeEnabled } from "@/lib/stripe-config";

import Link from "next/link";

import { notFound } from "next/navigation";



type ProjectPageProps = {

  params: Promise<{ locale: string; slug: string }>;

};



export async function generateMetadata({ params }: ProjectPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  const { slug } = await params;

  const project = await prisma.project.findFirst({

    where: { OR: [{ slug }, { id: slug }] },

    select: { title: true, description: true, slug: true },

  });



  if (!project) {

    return createMetadata({

      title: dict.projectDetail.notFound.title,
      description: dict.projectDetail.notFound.description,

      path: `/projects/${slug}`,
      locale,

      noIndex: true,

    });

  }



  return createMetadata({

    title: project.title,

    description: project.description.slice(0, 160),

    path: `/projects/${project.slug}`,
    locale,

    keywords: [dict.meta.projects.keywords?.[0] ?? "project", project.title],

  });

}



export default async function ProjectPage({ params }: ProjectPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  const { slug: slugOrId } = await params;

  const session = await auth();



  const resolved = await resolveProjectSlug(slugOrId);

  if (!resolved) notFound();



  const project = await getProjectDetailById(resolved.id);



  if (!project) notFound();



  const isOwner = session?.user?.id === project.clientId;

  const isAdmin = session?.user?.role === "ADMIN";

  const adminWorkMode = isAdmin ? await getAdminWorkMode() : null;

  const adminInFreelancerMode =

    isAdmin &&

    (adminWorkMode === "freelancer" || (!isOwner && adminWorkMode !== "client"));

  const isAssignedFreelancer =

    project.contract?.freelancerId === session?.user?.id;

  const canManage = isOwner || (isAdmin && adminWorkMode === "client");

  const isFreelancer =

    session?.user?.role === "FREELANCER" || adminInFreelancerMode;



  const canViewProject =
    canManage ||
    isAssignedFreelancer ||
    (project.status === "OPEN" && !project.blockedAt);



  if (!canViewProject) notFound();



  let viewsCount = project.viewsCount;

  if (!canManage && !isAssignedFreelancer && project.status === "OPEN") {

    const updated = await prisma.project.update({

      where: { id: project.id },

      data: { viewsCount: { increment: 1 } },

      select: { viewsCount: true },

    });

    viewsCount = updated.viewsCount;

  }



  const existingBid = session?.user?.id

    ? project.bids.find((bid) => bid.freelancerId === session.user.id)

    : null;

  if (session?.user?.id && (canManage || existingBid)) {
    await markBidMessageNotificationsReadForProject(session.user.id, project.id);
  }



  const featured = isFeaturedActive(project.featuredUntil, project.isFeatured);

  const showPublicBidFlow =

    !canManage && !isAssignedFreelancer && project.status === "OPEN";

  const showBidCta =

    showPublicBidFlow && session?.user && isFreelancer && !existingBid;

  const clientOrderStats =
    session?.user && isFreelancer && !canManage
      ? await getClientOrderStats(project.clientId)
      : null;

  const alreadyReported =
    session?.user?.id && !canManage
      ? await hasUserReportedProject(session.user.id, project.id)
      : false;



  const discussionContent =

    (canManage || isAssignedFreelancer) && project.conversation && session?.user?.id ? (

      <ProjectDiscussionPanel

        conversationId={project.conversation.id}

        projectTitle={project.title}

        projectId={project.id}

        currency={project.currency}

        projectStatus={project.status}

        contractStatus={project.contract?.status}

        contractAmount={
          project.contract ? Number(project.contract.amount) : null
        }

        isClient={canManage}

        clientBalance={Number(project.client.balance)}

        stripeEnabled={stripeEnabled}

        messages={project.conversation.messages}

        currentUserId={session.user.id}

        warnExternalLinks={shouldWarnExternalLinks(project.contract?.status)}

        partner={

          canManage

            ? {

                name: project.contract?.freelancer.name ?? null,

                avatar: project.contract?.freelancer.avatar ?? null,

              }

            : {

                name: project.client.name,

                avatar: project.client.avatar,

              }

        }

      />

    ) : (

      <p className="text-sm text-zinc-500">{dict.projectDetail.common.discussionLocked}</p>

    );



  const bidsContent = canManage ? (

    <ProjectBidList

      bids={project.bids}

      currency={project.currency}

      projectStatus={project.status}

      canAcceptBids={!project.contract}

      currentUserId={session?.user?.id}

    />

  ) : showPublicBidFlow ? (

    <div className="space-y-6">

      {session?.user ? (

        isFreelancer ? (

          existingBid ? (

            <FreelancerBidStatus

              bid={existingBid}

              currency={project.currency}

              currentUserId={session.user.id}

              client={{

                name: project.client.name,

                avatar: project.client.avatar,

              }}

            />

          ) : (

            <div id="project-bid-form">

              <BidForm projectId={project.id} currency={project.currency} />

            </div>

          )

        ) : (

          <p className="text-sm text-zinc-600">{dict.projectDetail.common.onlyFreelancerCanBid}</p>

        )

      ) : (

        <BidLoginPrompt callbackUrl={localizedPath(locale, `/projects/${project.slug}`)} />

      )}



      {project.bids.length > 0 && (

        <div className="border-t border-zinc-100 pt-6">

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {dict.projectDetail.common.bidListHiddenTitle}
          </h3>

          <p className="text-sm text-zinc-500">{dict.projectDetail.common.bidListHiddenBody}</p>

        </div>

      )}

    </div>

  ) : isAssignedFreelancer && existingBid ? (

    <FreelancerBidStatus

      bid={existingBid}

      currency={project.currency}

      currentUserId={session?.user?.id}

      client={{

        name: project.client.name,

        avatar: project.client.avatar,

      }}

    />

  ) : (

    <ProjectBidList

      bids={project.bids.filter(

        (bid) => bid.status === "ACCEPTED" || bid.freelancerId === session?.user?.id,

      )}

      currency={project.currency}

      projectStatus={project.status}

      canAcceptBids={false}

    />

  );



  return (

    <>

      <JsonLd

        data={[

          jobPostingJsonLd({

            title: project.title,

            description: project.description,

            slug: project.slug,

            budget: project.budget ? Number(project.budget) : null,

            currency: project.currency,

            createdAt: project.createdAt,

            deadline: project.deadline,

          }),

          breadcrumbJsonLd([

            { name: dict.projectDetail.common.breadcrumbs.home, url: absoluteUrl(localizedPath(locale, "/")) },

            { name: dict.projectDetail.common.breadcrumbs.projects, url: absoluteUrl(localizedPath(locale, "/projects")) },

            {

              name: project.title,

              url: absoluteUrl(localizedPath(locale, `/projects/${project.slug}`)),

            },

          ]),

        ]}

      />

      <AccountBrowsePage
        locale={locale}
        dict={dict}
        callbackUrl={`/projects/${project.slug}`}
        card={false}
      >

        <div className="space-y-6">

          <ProjectProgressBar

            status={project.status}

            contractStatus={project.contract?.status}

          />

          {project.status === "OPEN" && (
            <ProjectReportBar
              locale={locale}
              projectId={project.id}
              projectSlug={project.slug}
              reportCount={project.reportCount}
              underpricedReportCount={project.underpricedReportCount}
              moderationHot={project.moderationHot}
              hiddenFromCatalog={project.hiddenFromCatalog}
              canReport={Boolean(session?.user && isFreelancer && !canManage)}
              alreadyReported={alreadyReported}
              isOwner={canManage}
            />
          )}



          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <span

                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${projectStatusColors[project.status]}`}

                >

                  {dict.labels.projectStatus[project.status]}

                </span>

                {featured && <FeaturedBadge />}

                {project.category && (

                  <span className="text-sm text-zinc-500">

                    {project.category.name}

                  </span>

                )}

              </div>

              <h1 className="mt-3 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">

                {project.title}

              </h1>

            </div>

            <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-right lg:min-w-[180px]">

              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">

                {dict.projectDetail.common.budget}

              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-700">

                {formatBudget(project.budget, project.currency)}

              </p>

            </div>

          </div>



          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">

            <div className="space-y-6">

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

                <h2 className="text-lg font-semibold text-zinc-900">{dict.projectDetail.common.description}</h2>

                <div className="mt-5 prose-zinc max-w-none text-sm leading-7 text-zinc-700">

                  <MarkdownContent content={project.description} />

                </div>

              </section>



              {canManage && project.contract && (

                <ContractPanel

                  projectId={project.id}

                  projectStatus={project.status}

                  contract={project.contract}

                  currency={project.currency}

                  clientBalance={Number(project.client.balance)}

                  stripeEnabled={stripeEnabled}

                />

              )}



              {isAssignedFreelancer && project.contract && (

                <FreelancerContractPanel

                  projectId={project.id}

                  projectStatus={project.status}

                  contract={project.contract}

                  currency={project.currency}

                />

              )}



              {showBidCta && <ProjectBidCta />}



              <ProjectDetailTabs

                bidCount={

                  canManage

                    ? project._count.bids

                    : existingBid

                      ? 1

                      : 0

                }

                hasConversation={Boolean(

                  (canManage || isAssignedFreelancer) && project.conversation,

                )}

                bidsContent={bidsContent}

                discussionContent={discussionContent}

              />



              {project.status === "CLOSED" &&

                project.contract?.status === "RELEASED" &&

                session?.user?.id &&

                (project.clientId === session.user.id ||

                  project.contract.freelancerId === session.user.id) && (

                  <ProjectReviewsSection

                    contractId={project.contract.id}

                    clientId={project.clientId}

                    freelancerId={project.contract.freelancerId}

                    clientName={project.client.name}

                    freelancerName={project.contract.freelancer.name}

                    reviews={project.contract.reviews}

                    currentUserId={session.user.id}

                  />

                )}

            </div>



            <ProjectSidebar

              client={project.client}

              category={project.category?.name ?? null}

              createdAt={project.createdAt}

              viewsCount={viewsCount}

              bidCount={project._count.bids}

              deadline={project.deadline}

              budget={project.budget}

              currency={project.currency}

              canManage={canManage}

              projectSlug={project.slug}

              projectId={project.id}

              projectStatus={project.status}

              hasContract={Boolean(project.contract)}

              clientStats={clientOrderStats}

              showClientStatsForFreelancer={Boolean(clientOrderStats)}

            />

          </div>

        </div>

      </AccountBrowsePage>

    </>

  );

}


