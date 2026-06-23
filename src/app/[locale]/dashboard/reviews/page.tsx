import { ReviewsDashboard } from "@/components/ReviewsDashboard";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import {
  getPendingReviews,
  getReviewsGiven,
  getReviewsReceived,
  getUserReviewStats,
} from "@/lib/reviews";
import { requireFreelancer } from "@/lib/session";
import { Suspense } from "react";

type ReviewsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ReviewsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.reviews;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/dashboard/reviews",
    locale,
    noIndex: true,
  });
}

function ReviewsFallback() {
  return <div className="mt-6 h-40 animate-pulse rounded-xl bg-zinc-100" />;
}

export default async function FreelancerReviewsPage({ params }: ReviewsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.freelancer.reviews;
  const session = await requireFreelancer(localizedPath(locale, "/dashboard/reviews"));
  const userId = session.user.id;
  const reviewsPath = localizedPath(locale, "/dashboard/reviews");

  const [received, given, pending, stats] = await Promise.all([
    getReviewsReceived(userId),
    getReviewsGiven(userId),
    getPendingReviews(userId),
    getUserReviewStats(userId),
  ]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      <Suspense fallback={<ReviewsFallback />}>
        <div className="mt-6">
          <ReviewsDashboard
            received={received}
            given={given}
            pending={pending}
            stats={stats}
            reviewsPath={reviewsPath}
          />
        </div>
      </Suspense>
    </div>
  );
}
