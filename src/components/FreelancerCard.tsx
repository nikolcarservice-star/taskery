"use client";

import { ProBadge } from "@/components/ProBadge";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { AppLocale } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import { isProUser } from "@/lib/slug";
import Link from "next/link";

type FreelancerCardProps = {
  locale?: AppLocale;
  freelancer: {
    id: string;
    name: string | null;
    avatar: string | null;
    rating: number;
    bio: string | null;
    subscriptionPlan: string;
    featuredUntil: Date | null;
    freelancerProfile: {
      title: string | null;
      hourlyRate: { toString(): string } | null;
      skills: { name: string }[];
      _count?: { portfolioItems: number };
    } | null;
    completedProjects: number;
  };
};

export function FreelancerCard({ freelancer, locale = "ru" }: FreelancerCardProps) {
  const dict = useDictionary();
  const profile = freelancer.freelancerProfile;
  const hourlyRate = profile?.hourlyRate
    ? `${Number(profile.hourlyRate).toLocaleString(locale)} ${dict.catalog.freelancerCard.rateSuffix}`
    : null;
  const showPro = isProUser(
    freelancer.subscriptionPlan,
    freelancer.featuredUntil,
  );

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-lg font-semibold text-zinc-600">
          {freelancer.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={freelancer.avatar}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            (freelancer.name?.[0] ?? "F").toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-zinc-900">
            <Link
              href={localizedPath(locale, `/freelancers/${freelancer.id}`)}
              className="hover:text-blue-600"
            >
              {freelancer.name ?? dict.catalog.freelancerCard.freelancerFallback}
            </Link>
            {showPro && <ProBadge className="ml-2 align-middle" />}
          </h2>
          {profile?.title && (
            <p className="mt-0.5 text-sm text-zinc-600">{profile.title}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
            <span>
              ★ {freelancer.rating > 0 ? freelancer.rating.toFixed(1) : "—"}
            </span>
            <span>·</span>
            <span>{freelancer.completedProjects} {dict.catalog.freelancerCard.projectsCount}</span>
            {hourlyRate && (
              <>
                <span>·</span>
                <span>{hourlyRate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {freelancer.bio && (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
          {freelancer.bio}
        </p>
      )}

      {profile && profile.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 5).map((skill) => (
            <span
              key={skill.name}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700"
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
