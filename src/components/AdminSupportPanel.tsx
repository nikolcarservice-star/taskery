"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  closeSupportTicket,
  replySupportTicket,
  resolveSupportTicket,
  type TicketActionState,
} from "@/lib/actions/support-tickets";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AdminSupportTicketItem } from "@/lib/queries/admin-support";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: TicketActionState = {};

function TicketReplyForm({
  ticketId,
  locale,
}: {
  ticketId: string;
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.support;
  const c = getAdminCopy(locale).panels.common;
  const [state, formAction, pending] = useActionState(
    replySupportTicket,
    initialState,
  );

  return (
    <form action={formAction} className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
      <input type="hidden" name="ticketId" value={ticketId} />
      <textarea
        name="content"
        required
        rows={3}
        placeholder={p.replyPlaceholder}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {pending ? c.sending : c.reply}
        </button>
      </div>
      <AdminActionError error={state.error} locale={locale} className="text-xs text-red-600" />
      {state.success && <p className="text-xs text-green-700">{c.replySent}</p>}
    </form>
  );
}

function TicketCloseButton({
  ticketId,
  locale,
}: {
  ticketId: string;
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.support;
  const [state, formAction, pending] = useActionState(
    closeSupportTicket,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {p.closeTicket}
      </button>
      <AdminActionError error={state.error} locale={locale} className="mt-1 text-xs text-red-600" />
    </form>
  );
}

function TicketResolveButton({
  ticketId,
  locale,
}: {
  ticketId: string;
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.support;
  const [state, formAction, pending] = useActionState(
    resolveSupportTicket,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
      >
        {p.markResolved}
      </button>
      <AdminActionError error={state.error} locale={locale} className="mt-1 text-xs text-red-600" />
    </form>
  );
}

type AdminSupportPanelProps = {
  tickets: AdminSupportTicketItem[];
  locale: AppLocale;
  compact?: boolean;
};

export function AdminSupportPanel({
  tickets,
  locale,
  compact = false,
}: AdminSupportPanelProps) {
  const p = getAdminCopy(locale).panels.support;

  if (tickets.length === 0) {
    return (
      <section
        className={
          compact
            ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        }
      >
        <h2 className="text-lg font-semibold text-zinc-900">{p.titleEmpty}</h2>
        <p className="mt-3 text-sm text-zinc-600">{p.bodyEmpty}</p>
      </section>
    );
  }

  return (
    <section
      className={
        compact
          ? "space-y-3"
          : "rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
      }
    >
      {!compact && (
        <h2 className="text-lg font-semibold text-indigo-900">
          {p.title} ({tickets.length})
        </h2>
      )}

      <ul className={`space-y-3 ${compact ? "" : "mt-4"}`}>
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-medium text-indigo-800">
                {p.categories[ticket.category] ?? ticket.category}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-zinc-600">
                {p.statuses[ticket.status] ?? ticket.status}
              </span>
              <span className="text-zinc-500">
                {new Date(ticket.updatedAt).toLocaleString(locale)}
              </span>
            </div>

            <p className="mt-2 font-semibold text-zinc-900">{ticket.subject}</p>
            <p className="mt-1 text-sm text-zinc-600">
              {ticket.user.name ?? ticket.user.email}
            </p>

            {ticket.lastMessage && (
              <p className="mt-2 line-clamp-2 rounded-lg bg-white px-3 py-2 text-xs text-zinc-600">
                {ticket.lastMessage.isStaff ? p.staffPrefix : p.userPrefix}{" "}
                {ticket.lastMessage.content}
              </p>
            )}

            {ticket.status !== "CLOSED" && (
              <>
                <TicketReplyForm ticketId={ticket.id} locale={locale} />
                <div className="mt-2 flex flex-wrap gap-2">
                  <TicketResolveButton ticketId={ticket.id} locale={locale} />
                  <TicketCloseButton ticketId={ticket.id} locale={locale} />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
