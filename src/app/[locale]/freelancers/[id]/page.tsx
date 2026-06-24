import { AccountBrowsePage } from "@/components/account/AccountBrowsePage";
import { FreelancerPublicProfile } from "@/components/FreelancerPublicProfile";
import type { WorkAvailability } from "@/lib/freelancer-profile-shared";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";
import { hasUserReportedUser } from "@/lib/report-stats";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type FreelancerPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: FreelancerPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      role: true,
      freelancerProfile: { select: { title: true } },
    },
  });

  if (!user?.freelancerProfile || (user.role !== "FREELANCER" && user.role !== "ADMIN")) {
    return createMetadata({
      title: dict.meta.freelancers.title,
      description: dict.meta.freelancers.description,
      path: `/freelancers/${id}`,
      locale,
      noIndex: true,
    });
  }

  const title = user.freelancerProfile?.title;
  return createMetadata({
    title: user.name
      ? title
        ? `${user.name} — ${title} | Taskery`
        : `${user.name} — Taskery`
      : dict.meta.freelancers.title,
    description: dict.meta.freelancers.description,
    path: `/freelancers/${id}`,
    locale,
  });
}

export default async function FreelancerPage({ params }: FreelancerPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { id } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      languages: { orderBy: { language: "asc" } },
      freelancerProfile: {
        include: {
          skills: { orderBy: { name: "asc" } },
          portfolioItems: {
            where: { moderationStatus: "APPROVED" },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      contractsAsFreelancer: {
        where: { status: "RELEASED" },
        select: { id: true },
      },
      reviewsReceived: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          fromUser: { select: { name: true, role: true } },
          contract: { select: { _count: { select: { reviews: true } } } },
        },
      },
    },
  });

  if (
    !user?.freelancerProfile ||
    (user.role !== "FREELANCER" && user.role !== "ADMIN")
  ) {
    notFound();
  }

  const profile = user.freelancerProfile;
  const isOwnProfile = session?.user?.id === user.id;
  const alreadyReportedUser =
    session?.user?.id && !isOwnProfile
      ? await hasUserReportedUser(session.user.id, user.id)
      : false;
  const canReportUser = Boolean(session?.user?.id && !isOwnProfile);

  return (
    <AccountBrowsePage
      locale={locale}
      dict={dict}
      callbackUrl={`/freelancers/${id}`}
      card={false}
    >
      <FreelancerPublicProfile
        user={{
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          rating: user.rating,
          country: user.country,
          city: user.city,
          subscriptionPlan: user.subscriptionPlan,
          featuredUntil: user.featuredUntil,
          completedProjects: user.contractsAsFreelancer.length,
          languages: user.languages.map((item) => ({
            language: item.language,
            level: item.level,
          })),
        }}
        profile={{
          title: profile.title,
          hourlyRate: profile.hourlyRate?.toString() ?? null,
          workAvailability: profile.workAvailability as WorkAvailability,
          experienceYears: profile.experienceYears,
          website: profile.website,
          wantsFreelanceProjects: profile.wantsFreelanceProjects,
          wantsRemoteWork: profile.wantsRemoteWork,
          skills: profile.skills,
          portfolioItems: profile.portfolioItems,
          isVerified: profile.verificationStatus === "APPROVED",
        }}
        reviews={user.reviewsReceived
          .filter((review) => review.contract._count.reviews >= 2)
          .map((review) => ({
            id: review.id,
            rating: review.rating,
            text: review.text,
            createdAt: review.createdAt,
            fromUser: review.fromUser,
          }))}
        isOwnProfile={isOwnProfile}
        isViewerClient={
          session?.user?.role === "CLIENT" || session?.user?.role === "ADMIN"
        }
        isAdmin={user.role === "ADMIN"}
        canReportUser={canReportUser}
        alreadyReportedUser={alreadyReportedUser}
      />
    </AccountBrowsePage>
  );
}
