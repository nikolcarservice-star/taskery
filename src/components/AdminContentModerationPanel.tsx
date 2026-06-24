"use client";

import {
  adminApproveAvatar,
  adminApprovePortfolioItem,
  adminRejectAvatar,
  adminRejectPortfolioItem,
  type ContentModerationState,
} from "@/lib/actions/admin-content-moderation";
import type { ContentModerationOverview } from "@/lib/queries/admin-content-moderation";
import { useActionState } from "react";

const initialState: ContentModerationState = {};

export function AdminContentModerationPanel({
  queue,
}: {
  queue: ContentModerationOverview;
}) {
  const total = queue.portfolio.length + queue.avatars.length;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">
        Модерация контента ({total})
      </h2>

      {queue.avatars.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-zinc-700">Аватары</h3>
          <ul className="mt-2 space-y-3">
            {queue.avatars.map((item) => (
              <AvatarRow key={item.userId} item={item} />
            ))}
          </ul>
        </div>
      )}

      {queue.portfolio.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-zinc-700">Портфолио</h3>
          <ul className="mt-2 space-y-3">
            {queue.portfolio.map((item) => (
              <PortfolioRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      )}

      {total === 0 && (
        <p className="mt-3 text-sm text-zinc-600">Очередь пуста</p>
      )}
    </section>
  );
}

function AvatarRow({
  item,
}: {
  item: ContentModerationOverview["avatars"][number];
}) {
  const [approveState, approveAction, approvePending] = useActionState(
    adminApproveAvatar,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    adminRejectAvatar,
    initialState,
  );

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 sm:flex-row sm:items-center">
      <img
        src={item.pendingAvatar}
        alt=""
        className="h-16 w-16 rounded-full object-cover"
      />
      <div className="flex-1 text-sm">
        <p className="font-medium text-zinc-900">{item.name ?? item.email}</p>
        <p className="text-zinc-500">{item.email}</p>
      </div>
      <div className="flex gap-2">
        <form action={approveAction}>
          <input type="hidden" name="userId" value={item.userId} />
          <button
            type="submit"
            disabled={approvePending}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            Одобрить
          </button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="userId" value={item.userId} />
          <button
            type="submit"
            disabled={rejectPending}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50"
          >
            Отклонить
          </button>
        </form>
      </div>
      {(approveState.error || rejectState.error) && (
        <p className="text-xs text-red-600">{approveState.error ?? rejectState.error}</p>
      )}
    </li>
  );
}

function PortfolioRow({
  item,
}: {
  item: ContentModerationOverview["portfolio"][number];
}) {
  const [approveState, approveAction, approvePending] = useActionState(
    adminApprovePortfolioItem,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    adminRejectPortfolioItem,
    initialState,
  );

  return (
    <li className="rounded-xl border border-zinc-200 p-4">
      <p className="font-medium text-zinc-900">{item.title}</p>
      <p className="text-sm text-zinc-600">
        {item.freelancer.name ?? item.freelancer.email}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <form action={approveAction}>
          <input type="hidden" name="itemId" value={item.id} />
          <button
            type="submit"
            disabled={approvePending}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            Одобрить
          </button>
        </form>
        <form action={rejectAction} className="flex gap-2">
          <input type="hidden" name="itemId" value={item.id} />
          <input
            name="reason"
            placeholder="Причина"
            className="rounded-lg border border-zinc-300 px-2 py-1.5 text-xs"
          />
          <button
            type="submit"
            disabled={rejectPending}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50"
          >
            Отклонить
          </button>
        </form>
      </div>
      {(approveState.error || rejectState.error) && (
        <p className="mt-2 text-xs text-red-600">{approveState.error ?? rejectState.error}</p>
      )}
    </li>
  );
}
