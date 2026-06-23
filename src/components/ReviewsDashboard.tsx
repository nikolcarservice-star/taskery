"use client";

import { ReviewForm, ReviewList } from "@/components/ReviewForm";
import { useLocalizedPath } from "@/components/LocalizedLink";
import {
  getReviewerRoleLabel,
  reviewTargetLabel,
} from "@/lib/i18n/cabinet-form-options";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import {
  type PendingReviewRow,
  type ReviewRow,
} from "@/lib/reviews-shared";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type ReviewsDashboardProps = {
  received: ReviewRow[];
  given: ReviewRow[];
  pending: PendingReviewRow[];
  stats: {
    receivedCount: number;
    givenCount: number;
    pendingCount: number;
    rating: number;
  };
  reviewsPath: string;
};

type TabId = "pending" | "received" | "given";

const DATE_LOCALE: Record<string, string> = {
  ru: "ru-RU",
  uk: "uk-UA",
  pl: "pl-PL",
  en: "en-GB",
};

export function ReviewsDashboard({
  received,
  given,
  pending,
  stats,
  reviewsPath,
}: ReviewsDashboardProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = dict.cabinetForms.reviews;
  const tabs: { id: TabId; label: string }[] = [
    { id: "pending", label: t.tabs.pending },
    { id: "received", label: t.tabs.received },
    { id: "given", label: t.tabs.given },
  ];
  const activeTab = (searchParams.get("tab") as TabId) ?? "pending";

  function setTab(tab: TabId) {
    router.replace(`${reviewsPath}?tab=${tab}`, { scroll: false });
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString(DATE_LOCALE[locale] ?? "ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t.stats.rating}
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {stats.rating > 0 ? stats.rating.toFixed(1) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t.stats.received}
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {stats.receivedCount}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">
            {t.stats.pending}
          </p>
          <p className="mt-1 text-2xl font-bold text-indigo-700">
            {stats.pendingCount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
            {tab.id === "pending" && stats.pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                {stats.pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center">
              <p className="text-sm text-zinc-500">{t.emptyPending}</p>
            </div>
          ) : (
            pending.map((item) => (
              <article
                key={item.contractId}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={l(`/projects/${item.projectSlug}`)}
                      className="text-base font-semibold text-zinc-900 hover:text-indigo-600"
                    >
                      {item.projectTitle}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-600">
                      {t.ratePartner.replace(
                        "{target}",
                        reviewTargetLabel(dict, item.partnerRole),
                      )}{" "}
                      {item.partnerName ? `«${item.partnerName}»` : ""}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {t.completedAt.replace("{date}", formatDate(item.completedAt))}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    {getReviewerRoleLabel(dict, item.partnerRole)}
                  </span>
                </div>
                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <ReviewForm
                    contractId={item.contractId}
                    toUserName={item.partnerName}
                    partnerRole={item.partnerRole}
                    compact
                  />
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {activeTab === "received" && (
        <ReviewList
          reviews={received.map((review) => ({
            id: review.id,
            rating: review.rating,
            text: review.text,
            createdAt: review.createdAt,
            fromUser: review.fromUser,
            contract: review.contract,
          }))}
          showProject
          emptyLabel={t.emptyReceived}
        />
      )}

      {activeTab === "given" && (
        <ReviewList
          reviews={given.map((review) => ({
            id: review.id,
            rating: review.rating,
            text: review.text,
            createdAt: review.createdAt,
            fromUser: {
              name: t.givenReviewPrefix.replace(
                "{name}",
                review.toUser.name ?? dict.cabinetForms.common.user,
              ),
              role: review.fromUser.role,
            },
            contract: review.contract,
          }))}
          showProject
          emptyLabel={t.emptyGiven}
        />
      )}
    </div>
  );
}
