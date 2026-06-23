"use client";

import { AcceptBidButton } from "@/components/AcceptBidButton";
import { BidMessageThread } from "@/components/BidMessageThread";
import { ProBadge } from "@/components/ProBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import {
  bidStatusColors,
  formatMoney,
} from "@/lib/project-labels";
import type { AppLocale } from "@/lib/i18n/types";
import { isProUser } from "@/lib/slug";
import { BidStatus, ProjectStatus } from "@/generated/prisma/client";
import Link from "next/link";

export type BidMessageItem = {
  id: string;
  content: string;
  createdAt: Date;
  sender: { id: string; name: string | null; avatar?: string | null };
};

export type BidListItem = {
  id: string;
  cost: { toString(): string };
  timeframe: number;
  coverLetter: string;
  status: BidStatus;
  createdAt: Date;
  freelancer: {
    id: string;
    name: string | null;
    rating: number;
    avatar?: string | null;
    subscriptionPlan?: string;
    featuredUntil?: Date | null;
  };
  messages?: BidMessageItem[];
};

type ProjectBidListProps = {
  bids: BidListItem[];
  currency: string;
  projectStatus: ProjectStatus;
  canAcceptBids: boolean;
  currentUserId?: string;
  locale?: AppLocale;
};

function BidCard({
  bid,
  currency,
  showAccept,
  currentUserId,
  locale,
}: {
  bid: BidListItem;
  currency: string;
  showAccept: boolean;
  currentUserId?: string;
  locale?: AppLocale;
}) {
  const dict = useDictionary();
  const contextLocale = useDictionaryLocale();
  const l = useLocalizedPath();
  const activeLocale = locale ?? contextLocale;
  const showPro = isProUser(
    bid.freelancer.subscriptionPlan ?? "FREE",
    bid.freelancer.featuredUntil ?? null,
  );
  const canMessage =
    Boolean(currentUserId) &&
    bid.status === "PENDING" &&
    showAccept;

  return (
    <article className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <UserAvatar
            name={bid.freelancer.name}
            avatar={bid.freelancer.avatar}
            className="h-12 w-12"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={l(`/freelancers/${bid.freelancer.id}`)}
                className="font-semibold text-zinc-900 hover:text-indigo-600"
              >
                {bid.freelancer.name ?? dict.projectDetail.common.freelancerFallback}
              </Link>
              {showPro && <ProBadge />}
            </div>
            <p className="mt-1 text-sm text-amber-600">
              ★{" "}
              {bid.freelancer.rating > 0
                ? bid.freelancer.rating.toFixed(1)
                : dict.projectDetail.common.newFreelancer}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-emerald-700">
            {formatMoney(bid.cost, currency, locale)}
          </p>
          <p className="text-sm text-zinc-500">
            {bid.timeframe} {dict.projectDetail.common.daysShort}
          </p>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
        {bid.coverLetter}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 pt-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${bidStatusColors[bid.status]}`}
        >
          {dict.labels.bidStatus[bid.status]}
        </span>
        <span className="text-xs text-zinc-500">
          {bid.createdAt.toLocaleDateString(activeLocale, {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {canMessage && currentUserId && (
        <BidMessageThread
          bidId={bid.id}
          messages={bid.messages ?? []}
          currentUserId={currentUserId}
          partner={{
            name: bid.freelancer.name,
            avatar: bid.freelancer.avatar ?? null,
          }}
        />
      )}

      {showAccept && bid.status === "PENDING" && (
        <div className="mt-4">
          <AcceptBidButton
            bidId={bid.id}
            freelancerName={bid.freelancer.name}
            cost={Number(bid.cost)}
            currency={currency}
          />
        </div>
      )}
    </article>
  );
}

export function ProjectBidList({
  bids,
  currency,
  projectStatus,
  canAcceptBids,
  currentUserId,
  locale,
}: ProjectBidListProps) {
  const dict = useDictionary();

  if (bids.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center">
        <p className="text-sm font-medium text-zinc-900">{dict.projectDetail.bidList.emptyTitle}</p>
        <p className="mt-1 text-sm text-zinc-500">
          {dict.projectDetail.bidList.emptyBody}
        </p>
      </div>
    );
  }

  const showAccept = canAcceptBids && projectStatus === "OPEN";

  return (
    <ul className="space-y-4">
      {bids.map((bid) => (
        <li key={bid.id}>
          <BidCard
            bid={bid}
            currency={currency}
            showAccept={showAccept}
            currentUserId={currentUserId}
            locale={locale}
          />
        </li>
      ))}
    </ul>
  );
}

export function FreelancerBidStatus({
  bid,
  currency,
  currentUserId,
  client,
  locale,
}: {
  bid: BidListItem;
  currency: string;
  currentUserId?: string;
  locale?: AppLocale;
  client?: {
    name: string | null;
    avatar: string | null;
  };
}) {
  const dict = useDictionary();
  const canMessage =
    Boolean(currentUserId) && bid.status === "PENDING";
  const clientHasWritten = (bid.messages ?? []).some(
    (message) => message.sender.id !== currentUserId,
  );
  const showMessageThread =
    canMessage && currentUserId && client && clientHasWritten;

  return (
    <article className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-zinc-900">{dict.projectDetail.bidList.yourBid}</p>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${bidStatusColors[bid.status]}`}
        >
          {dict.labels.bidStatus[bid.status]}
        </span>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-white px-4 py-3 ring-1 ring-zinc-200/80">
          <dt className="text-zinc-500">{dict.projectDetail.bidList.yourCost}</dt>
          <dd className="mt-1 text-lg font-bold text-emerald-700">
            {formatMoney(bid.cost, currency, locale)}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-3 ring-1 ring-zinc-200/80">
          <dt className="text-zinc-500">{dict.projectDetail.bidList.yourTimeframe}</dt>
          <dd className="mt-1 text-lg font-bold text-zinc-900">
            {bid.timeframe} {dict.projectDetail.common.daysShort}
          </dd>
        </div>
      </dl>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
        {bid.coverLetter}
      </p>

      {showMessageThread && (
        <BidMessageThread
          bidId={bid.id}
          messages={bid.messages ?? []}
          currentUserId={currentUserId}
          partner={client}
          defaultOpen
        />
      )}

      {bid.status === "ACCEPTED" && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {dict.projectDetail.bidList.selectedSuccess}
        </p>
      )}
      {bid.status === "REJECTED" && (
        <p className="mt-4 text-sm text-zinc-600">
          {dict.projectDetail.bidList.rejectedText}
        </p>
      )}
    </article>
  );
}
