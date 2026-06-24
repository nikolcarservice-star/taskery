"use client";

import { ProBadge } from "@/components/ProBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ReportUserButton } from "@/components/ReportUserButton";
import { ReviewList } from "@/components/ReviewForm";
import { UserAvatar } from "@/components/UserAvatar";
import { useLocalizedPath } from "@/components/LocalizedLink";
import type { WorkAvailability } from "@/lib/freelancer-profile-shared";
import {
  WORK_AVAILABILITY_COLORS,
  WORK_AVAILABILITY_LABELS,
} from "@/lib/freelancer-profile-shared";
import {
  countryLabel,
  languageLabel,
  levelLabel,
  type LanguageLevel,
} from "@/lib/personal-data-shared";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { resolveAssetDisplayUrl } from "@/lib/blob-url";
import { isProUser } from "@/lib/slug";
import Link from "next/link";

export type FreelancerPortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
};

export type FreelancerReviewItem = {
  id: string;
  rating: number;
  text: string | null;
  createdAt: Date;
  fromUser: { name: string | null; role?: string };
};

export type FreelancerPublicProfileProps = {
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    rating: number;
    country: string | null;
    city: string | null;
    subscriptionPlan: string;
    featuredUntil: Date | null;
    completedProjects: number;
    languages: { language: string; level: LanguageLevel }[];
  };
  profile: {
    title: string | null;
    hourlyRate: string | null;
    workAvailability: WorkAvailability;
    experienceYears: number | null;
    website: string | null;
    wantsFreelanceProjects: boolean;
    wantsRemoteWork: boolean;
    skills: { id: string; name: string }[];
    portfolioItems: FreelancerPortfolioItem[];
    isVerified: boolean;
  };
  reviews: FreelancerReviewItem[];
  isOwnProfile: boolean;
  isViewerClient: boolean;
  isAdmin?: boolean;
  canReportUser?: boolean;
  alreadyReportedUser?: boolean;
};

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        accent
          ? "border-indigo-200 bg-indigo-50/80"
          : "border-zinc-200/80 bg-white/80"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-semibold ${
          accent ? "text-indigo-700" : "text-zinc-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PortfolioCard({
  item,
  viewLabel,
}: {
  item: FreelancerPortfolioItem;
  viewLabel: string;
}) {
  const imageSrc = resolveAssetDisplayUrl(item.imageUrl);

  return (
    <article className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
          <svg
            aria-hidden="true"
            className="h-12 w-12 text-indigo-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-zinc-900">{item.title}</h3>
        {item.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {item.description}
          </p>
        )}
        {item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {viewLabel}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function FreelancerPublicProfile({
  user,
  profile,
  reviews,
  isOwnProfile,
  isViewerClient,
  isAdmin = false,
  canReportUser = false,
  alreadyReportedUser = false,
}: FreelancerPublicProfileProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const isBoost = isProUser(user.subscriptionPlan, user.featuredUntil);
  const availability = profile.workAvailability;
  const location = [user.city, countryLabel(user.country)]
    .filter(Boolean)
    .join(", ");
  const hourlyRate = profile.hourlyRate
    ? `${Number(profile.hourlyRate).toLocaleString(locale)} ${dict.catalog.freelancerCard.rateSuffix}`
    : null;
  const ratingLabel =
    user.rating > 0 ? user.rating.toFixed(1) : dict.freelancerProfile.ratingNew;

  return (
    <div className="space-y-8">
      <div
        className={`overflow-hidden rounded-2xl border shadow-sm ${
          isBoost
            ? "border-indigo-200 bg-white ring-1 ring-indigo-100"
            : "border-zinc-200 bg-white"
        }`}
      >
        <div className="relative px-6 pb-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <UserAvatar
                name={user.name}
                avatar={user.avatar}
                size="lg"
                isAdmin={isAdmin}
                className={`border-4 border-zinc-100 shadow-md ${
                  isBoost
                    ? "ring-4 ring-indigo-200"
                    : "ring-4 ring-zinc-100"
                }`}
              />
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                    {user.name ?? dict.freelancerProfile.fallbackName}
                  </h1>
                  {isBoost && <ProBadge />}
                  {profile.isVerified && (
                    <VerifiedBadge title={dict.profileVerification.verifiedBadgeTitle} />
                  )}
                </div>
                {profile.title && (
                  <p className="mt-1 text-base text-zinc-600 sm:text-lg">
                    {profile.title}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${WORK_AVAILABILITY_COLORS[availability]}`}
                  >
                    {WORK_AVAILABILITY_LABELS[availability]}
                  </span>
                  {location && (
                    <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>
                      {location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {canReportUser && (
                <ReportUserButton
                  userId={user.id}
                  canReport={canReportUser}
                  alreadyReported={alreadyReportedUser}
                />
              )}
              {isOwnProfile ? (
                <Link
                  href={l("/dashboard/profile")}
                  className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                >
                  {dict.freelancerProfile.editProfile}
                </Link>
              ) : isViewerClient ? (
                <Link
                  href={l("/projects/new")}
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {dict.freelancerProfile.proposeProject}
                </Link>
              ) : (
                <Link
                  href={`${l("/register")}?role=CLIENT`}
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {dict.freelancerProfile.hireFreelancer}
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={dict.freelancerProfile.stats.rating} value={ratingLabel} accent={user.rating > 0} />
            <StatCard
              label={dict.freelancerProfile.stats.projects}
              value={String(user.completedProjects)}
            />
            <StatCard
              label={dict.freelancerProfile.stats.rate}
              value={hourlyRate ?? dict.freelancerProfile.stats.negotiable}
              accent={Boolean(hourlyRate)}
            />
            <StatCard
              label={dict.freelancerProfile.stats.experience}
              value={
                profile.experienceYears
                  ? `${profile.experienceYears} ${profile.experienceYears === 1 ? dict.freelancerProfile.stats.experienceYear : profile.experienceYears < 5 ? dict.freelancerProfile.stats.experienceFew : dict.freelancerProfile.stats.experienceMany}`
                  : dict.freelancerProfile.stats.notSpecified
              }
            />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SectionCard title={dict.freelancerProfile.cooperation.title}>
            <ul className="space-y-3 text-sm text-zinc-700">
              {profile.wantsFreelanceProjects && (
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span>
                  {dict.freelancerProfile.cooperation.freelanceProjects}
                </li>
              )}
              {profile.wantsRemoteWork && (
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span>
                  {dict.freelancerProfile.cooperation.remoteWork}
                </li>
              )}
              {!profile.wantsFreelanceProjects && !profile.wantsRemoteWork && (
                <li className="text-zinc-500">{dict.freelancerProfile.cooperation.notSpecified}</li>
              )}
            </ul>
          </SectionCard>

          {user.languages.length > 0 && (
            <SectionCard title={dict.freelancerProfile.languages}>
              <ul className="space-y-2">
                {user.languages.map((item) => (
                  <li
                    key={`${item.language}-${item.level}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium text-zinc-900">
                      {languageLabel(item.language)}
                    </span>
                    <span className="text-zinc-500">
                      {levelLabel(item.level)}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {profile.website && (
            <SectionCard title={dict.freelancerProfile.website}>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm font-medium text-indigo-600 hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            </SectionCard>
          )}
        </aside>

        <div className="space-y-6">
          <SectionCard title={dict.freelancerProfile.about.title}>
            {user.bio ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                {dict.freelancerProfile.about.empty}
              </p>
            )}
          </SectionCard>

          {profile.skills.length > 0 && (
            <SectionCard title={dict.freelancerProfile.skills}>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {profile.portfolioItems.length > 0 && (
            <SectionCard title={dict.freelancerProfile.portfolio}>
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.portfolioItems.map((item) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    viewLabel={dict.freelancerProfile.portfolioViewWork}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title={dict.freelancerProfile.reviews}>
            <ReviewList reviews={reviews} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
