"use client";

import {
  closeSupportTicket,
  replySupportTicket,
  resolveSupportTicket,
  type TicketActionState,
} from "@/lib/actions/support-tickets";
import type { AdminSupportTicketItem } from "@/lib/queries/admin-support";
import { useActionState } from "react";

const initialState: TicketActionState = {};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Новое",
  IN_PROGRESS: "В работе",
  RESOLVED: "Решено",
  CLOSED: "Закрыто",
};

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "Общее",
  PAYMENT: "Оплата",
  DISPUTE: "Спор",
  ACCOUNT: "Аккаунт",
  OTHER: "Другое",
};

function TicketReplyForm({ ticketId }: { ticketId: string }) {
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
        placeholder="Ответ пользователю"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {pending ? "Отправка…" : "Ответить"}
        </button>
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="text-xs text-green-700">Ответ отправлен</p>}
    </form>
  );
}

function TicketCloseButton({ ticketId }: { ticketId: string }) {
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
        Закрыть обращение
      </button>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

function TicketResolveButton({ ticketId }: { ticketId: string }) {
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
        Отметить решённым
      </button>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

type AdminSupportPanelProps = {
  tickets: AdminSupportTicketItem[];
  compact?: boolean;
};

export function AdminSupportPanel({ tickets, compact = false }: AdminSupportPanelProps) {
  if (tickets.length === 0) {
    return (
      <section
        className={
          compact
            ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        }
      >
        <h2 className="text-lg font-semibold text-zinc-900">Поддержка (0)</h2>
        <p className="mt-3 text-sm text-zinc-600">Открытых обращений нет</p>
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
          Поддержка ({tickets.length})
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
                {CATEGORY_LABELS[ticket.category] ?? ticket.category}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-zinc-600">
                {STATUS_LABELS[ticket.status] ?? ticket.status}
              </span>
              <span className="text-zinc-500">
                {new Date(ticket.updatedAt).toLocaleString("ru-RU")}
              </span>
            </div>

            <p className="mt-2 font-semibold text-zinc-900">{ticket.subject}</p>
            <p className="mt-1 text-sm text-zinc-600">
              {ticket.user.name ?? ticket.user.email}
            </p>

            {ticket.lastMessage && (
              <p className="mt-2 line-clamp-2 rounded-lg bg-white px-3 py-2 text-xs text-zinc-600">
                {ticket.lastMessage.isStaff ? "Поддержка: " : "Пользователь: "}
                {ticket.lastMessage.content}
              </p>
            )}

            {ticket.status !== "CLOSED" && (
              <>
                <TicketReplyForm ticketId={ticket.id} />
                <div className="mt-2 flex flex-wrap gap-2">
                  <TicketResolveButton ticketId={ticket.id} />
                  <TicketCloseButton ticketId={ticket.id} />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
