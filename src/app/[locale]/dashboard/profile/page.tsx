import { FreelancerProfileSettings } from "@/components/FreelancerProfileSettings";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { getAllSkills, getFreelancerProfileData } from "@/lib/freelancer-profile";
import { requireFreelancer } from "@/lib/session";
import { Suspense } from "react";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.profile;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard/profile",
    locale,
    noIndex: true,
  });
}

function ProfileFallback() {
  return <div className="mt-6 h-40 animate-pulse rounded-xl bg-zinc-100" />;
}

export default async function FreelancerProfilePage({ params }: ProfilePageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.profile;
  const session = await requireFreelancer(localizedPath(locale, "/dashboard/profile"));

  const [data, skills] = await Promise.all([
    getFreelancerProfileData(session.user.id),
    getAllSkills(),
  ]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <Suspense fallback={<ProfileFallback />}>
        <FreelancerProfileSettings data={data} skills={skills} />
      </Suspense>
    </div>
  );
}
