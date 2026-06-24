"use client";

import {
  adminApproveAvatar,
  adminApprovePortfolioItem,
  adminRejectAvatar,
  adminRejectPortfolioItem,
  type ContentModerationState,
} from "@/lib/actions/admin-content-moderation";
import { getAdminCopy } from "@/lib/admin-i18n";
import { resolveAssetDisplayUrl } from "@/lib/blob-url";
import type { ContentModerationOverview } from "@/lib/queries/admin-content-moderation";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState, useState } from "react";

const initialState: ContentModerationState = {};

const approveButtonClass =
  "w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors active:bg-emerald-700 disabled:opacity-50 sm:w-auto sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium";

const rejectButtonClass =
  "w-full rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition-colors active:bg-red-50 disabled:opacity-50 sm:w-auto sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium";

function ModerationPreviewImage({
  url,
  name,
  className = "h-20 w-20 rounded-2xl object-cover sm:h-16 sm:w-16 sm:rounded-full",
  rounded = "rounded-2xl sm:rounded-full",
}: {
  url: string | null | undefined;
  name: string;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = resolveAssetDisplayUrl(url);
  const initial = (name[0] ?? "U").toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-indigo-100 text-lg font-semibold text-indigo-700 ${rounded} ${className}`}
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`shrink-0 bg-zinc-100 ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

export function AdminContentModerationPanel({
  queue,
  locale,
}: {
  queue: ContentModerationOverview;
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.contentModeration;
  const total = queue.portfolio.length + queue.avatars.length;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
        {p.title} ({total})
      </h2>

      {queue.avatars.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-zinc-700">{p.avatars}</h3>
          <ul className="mt-2 space-y-3">
            {queue.avatars.map((item) => (
              <AvatarRow key={item.userId} item={item} locale={locale} />
            ))}
          </ul>
        </div>
      )}

      {queue.portfolio.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-zinc-700">{p.portfolio}</h3>
          <ul className="mt-2 space-y-3">
            {queue.portfolio.map((item) => (
              <PortfolioRow key={item.id} item={item} locale={locale} />
            ))}
          </ul>
        </div>
      )}

      {total === 0 && (
        <p className="mt-3 text-sm text-zinc-600">{p.empty}</p>
      )}
    </section>
  );
}

function AvatarRow({
  item,
  locale,
}: {
  item: ContentModerationOverview["avatars"][number];
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.common;
  const displayName = item.name ?? item.email;
  const [approveState, approveAction, approvePending] = useActionState(
    adminApproveAvatar,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    adminRejectAvatar,
    initialState,
  );

  return (
    <li className="rounded-xl border border-zinc-200 p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <ModerationPreviewImage
          url={item.pendingAvatar}
          name={displayName}
          className="h-20 w-20 rounded-2xl object-cover sm:h-16 sm:w-16 sm:rounded-full"
        />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium text-zinc-900">{displayName}</p>
          <p className="truncate text-zinc-500">{item.email}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <form action={approveAction} className="min-w-0">
          <input type="hidden" name="userId" value={item.userId} />
          <button type="submit" disabled={approvePending} className={approveButtonClass}>
            {c.approve}
          </button>
        </form>
        <form action={rejectAction} className="min-w-0">
          <input type="hidden" name="userId" value={item.userId} />
          <button type="submit" disabled={rejectPending} className={rejectButtonClass}>
            {c.reject}
          </button>
        </form>
      </div>

      {(approveState.error || rejectState.error) && (
        <p className="mt-2 text-xs text-red-600">
          {approveState.error ?? rejectState.error}
        </p>
      )}
    </li>
  );
}

function PortfolioRow({
  item,
  locale,
}: {
  item: ContentModerationOverview["portfolio"][number];
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.common;
  const displayName = item.freelancer.name ?? item.freelancer.email;
  const [approveState, approveAction, approvePending] = useActionState(
    adminApprovePortfolioItem,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    adminRejectPortfolioItem,
    initialState,
  );

  return (
    <li className="rounded-xl border border-zinc-200 p-3 sm:p-4">
      {item.imageUrl ? (
        <ModerationPreviewImage
          url={item.imageUrl}
          name={displayName}
          className="mb-3 h-40 w-full rounded-xl object-cover sm:h-32 sm:w-40"
          rounded="rounded-xl"
        />
      ) : null}

      <p className="font-medium text-zinc-900">{item.title}</p>
      <p className="text-sm text-zinc-600">{displayName}</p>

      <div className="mt-3 space-y-2">
        <form action={approveAction}>
          <input type="hidden" name="itemId" value={item.id} />
          <button type="submit" disabled={approvePending} className={approveButtonClass}>
            {c.approve}
          </button>
        </form>

        <form action={rejectAction} className="space-y-2">
          <input type="hidden" name="itemId" value={item.id} />
          <input
            name="reason"
            placeholder={c.reason}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm sm:rounded-lg sm:px-2 sm:py-1.5 sm:text-xs"
          />
          <button type="submit" disabled={rejectPending} className={rejectButtonClass}>
            {c.reject}
          </button>
        </form>
      </div>

      {(approveState.error || rejectState.error) && (
        <p className="mt-2 text-xs text-red-600">
          {approveState.error ?? rejectState.error}
        </p>
      )}
    </li>
  );
}
