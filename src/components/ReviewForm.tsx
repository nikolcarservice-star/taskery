"use client";

import { createReview, type ActionState } from "@/lib/actions/reviews";
import { FormActionError } from "@/components/FormActionError";
import {
  reviewTargetLabel,
} from "@/lib/i18n/cabinet-form-options";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import type { Role } from "@/generated/prisma/client";
import { useActionState, useState } from "react";

const initialState: ActionState = {};

const DATE_LOCALE: Record<string, string> = {
  ru: "ru-RU",
  uk: "uk-UA",
  pl: "pl-PL",
  en: "en-GB",
};

type ReviewFormProps = {
  contractId: string;
  toUserName: string | null;
  partnerRole: Role;
  compact?: boolean;
};

function StarRatingInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className={`rounded p-0.5 text-2xl transition-colors ${
              active ? "text-amber-400" : "text-zinc-300 hover:text-amber-300"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm({
  contractId,
  toUserName,
  partnerRole,
  compact = false,
}: ReviewFormProps) {
  const dict = useDictionary();
  const t = dict.cabinetForms.reviews.form;
  const target = reviewTargetLabel(dict, partnerRole);
  const [state, formAction, pending] = useActionState(createReview, initialState);
  const [rating, setRating] = useState(5);

  if (state.success) {
    return (
      <p className="text-sm font-medium text-emerald-700">{t.successThanks}</p>
    );
  }

  const rateText = t.rateTarget.replace("{target}", target);

  return (
    <form action={formAction} className={compact ? "space-y-3" : "space-y-4"}>
      <input type="hidden" name="contractId" value={contractId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <p className="text-sm text-zinc-600">
          {rateText}
          {toUserName ? `: ${toUserName}` : ""}
        </p>
        <div className="mt-2">
          <StarRatingInput
            value={rating}
            onChange={setRating}
            ariaLabel={t.ratingAria}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`review-text-${contractId}`} className="block text-sm font-medium text-zinc-700">
          {t.comment}
        </label>
        <textarea
          id={`review-text-${contractId}`}
          name="text"
          rows={compact ? 3 : 4}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          placeholder={t.commentPlaceholder}
        />
      </div>

      <FormActionError error={state.error} className="text-sm text-red-600" />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}

export function ReviewList({
  reviews,
  emptyLabel,
  showProject = false,
}: {
  reviews: {
    id: string;
    rating: number;
    text: string | null;
    createdAt: Date;
    fromUser: { name: string | null; role?: string };
    contract?: { project: { title: string; slug: string } };
  }[];
  emptyLabel?: string;
  showProject?: boolean;
}) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const t = dict.cabinetForms.reviews.list;
  const common = dict.cabinetForms.common;
  const roles = dict.cabinetForms.options.reviewerRoles;
  const label = emptyLabel ?? t.emptyDefault;

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center">
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-900">
                  {review.fromUser.name ?? common.user}
                </span>
                {review.fromUser.role && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-zinc-500 ring-1 ring-zinc-200">
                    {review.fromUser.role === "CLIENT"
                      ? roles.CLIENT
                      : roles.FREELANCER}
                  </span>
                )}
              </div>
              {showProject && review.contract?.project && (
                <p className="mt-1 text-xs text-zinc-500">
                  {t.projectPrefix} {review.contract.project.title}
                </p>
              )}
              <p className="mt-1 text-xs text-zinc-500">
                {review.createdAt.toLocaleDateString(DATE_LOCALE[locale] ?? "ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="shrink-0 text-amber-500">
              {"★".repeat(review.rating)}
              <span className="sr-only">
                {t.starsOf5.replace("{rating}", String(review.rating))}
              </span>
            </span>
          </div>
          {review.text && (
            <p className="mt-3 leading-6 text-zinc-700">{review.text}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
