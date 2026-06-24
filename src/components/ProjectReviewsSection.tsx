"use client";

import { ReviewForm, ReviewList } from "@/components/ReviewForm";
import { useLocalizedPath } from "@/components/LocalizedLink";
import type { Role } from "@/generated/prisma/client";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import {
  isMutualReviewComplete,
  REVIEWER_ROLE_LABELS,
  reviewsVisibleToParticipant,
} from "@/lib/reviews-shared";
import Link from "next/link";

type ProjectReview = {
  id: string;
  rating: number;
  text: string | null;
  createdAt: Date;
  fromUserId: string;
  fromUser: { id: string; name: string | null; role: Role };
};

type ProjectReviewsSectionProps = {
  contractId: string;
  clientId: string;
  freelancerId: string;
  clientName: string | null;
  freelancerName: string | null;
  reviews: ProjectReview[];
  currentUserId: string;
};

function reviewSideLabel(fromUserId: string, clientId: string, dict: ReturnType<typeof useDictionary>): string {
  return fromUserId === clientId
    ? dict.projectDetail.reviews.clientToFreelancer
    : dict.projectDetail.reviews.freelancerToClient;
}

export function ProjectReviewsSection({
  contractId,
  clientId,
  freelancerId,
  clientName,
  freelancerName,
  reviews,
  currentUserId,
}: ProjectReviewsSectionProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const isClient = currentUserId === clientId;
  const isFreelancer = currentUserId === freelancerId;
  const myReview = reviews.find((review) => review.fromUserId === currentUserId);
  const partnerReview = reviews.find((review) => review.fromUserId !== currentUserId);
  const mutualComplete = isMutualReviewComplete(reviews.length);
  const publishedReviews = reviewsVisibleToParticipant(reviews, currentUserId);

  const partnerName = isClient ? freelancerName : clientName;
  const partnerRole: Role = isClient ? "FREELANCER" : "CLIENT";

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{dict.projectDetail.reviews.title}</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {dict.projectDetail.reviews.intro}
          </p>
        </div>
        <Link
          href={isFreelancer ? l("/dashboard/reviews") : l("/client/reviews")}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {dict.projectDetail.reviews.allReviews}
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mutualComplete ? (
          publishedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {reviewSideLabel(review.fromUserId, clientId, dict)}
              </p>
              <div className="mt-3">
                <ReviewList
                  reviews={[
                    {
                      ...review,
                      fromUser: {
                        name: review.fromUser.name,
                        role: review.fromUser.role,
                      },
                    },
                  ]}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center lg:col-span-2">
            <p className="text-sm text-zinc-500">
              {myReview
                ? `${dict.projectDetail.reviews.waitingPartnerPrefix}${partnerName ?? dict.projectDetail.reviews.waitingPartnerFallback}.`
                : dict.projectDetail.reviews.hiddenUntilMutual}
            </p>
          </div>
        )}
      </div>

      {!mutualComplete && (
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h3 className="font-medium text-zinc-900">
            {myReview
              ? dict.projectDetail.reviews.myReviewDone
              : `${dict.projectDetail.reviews.myReviewTitlePrefix}${REVIEWER_ROLE_LABELS[isClient ? "CLIENT" : "FREELANCER"].toLowerCase()}`}
          </h3>

          {myReview ? (
            <div className="mt-3">
              <ReviewList
                reviews={[
                  {
                    ...myReview,
                    fromUser: {
                      name: myReview.fromUser.name,
                      role: myReview.fromUser.role,
                    },
                  },
                ]}
              />
              {!partnerReview && (
                <p className="mt-3 text-sm text-zinc-600">
                  {dict.projectDetail.reviews.waitingPartnerPrefix}
                  {partnerName ?? dict.projectDetail.reviews.waitingPartnerFallback}.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <ReviewForm
                contractId={contractId}
                toUserName={partnerName}
                partnerRole={partnerRole}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
