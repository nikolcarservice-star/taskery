"use client";

import { replySupportTicket, type TicketActionState } from "@/lib/actions/support-tickets";
import { FormActionError } from "@/components/FormActionError";
import { useActionState } from "react";

const initialState: TicketActionState = {};

type SupportTicketThreadProps = {
  ticketId: string;
  messages: {
    id: string;
    content: string;
    isStaff: boolean;
    createdAt: string;
    sender: { name: string | null; role: string };
  }[];
  closed: boolean;
};

export function SupportTicketThread({
  ticketId,
  messages,
  closed,
}: SupportTicketThreadProps) {
  const [state, formAction, pending] = useActionState(
    replySupportTicket,
    initialState,
  );

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`rounded-xl px-4 py-3 text-sm ${
              message.isStaff
                ? "border border-indigo-100 bg-indigo-50 text-indigo-950"
                : "border border-zinc-200 bg-zinc-50 text-zinc-900"
            }`}
          >
            <p className="text-xs font-medium text-zinc-500">
              {message.isStaff
                ? "Поддержка"
                : (message.sender.name ?? "Вы")}{" "}
              · {new Date(message.createdAt).toLocaleString("ru-RU")}
            </p>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </li>
        ))}
      </ul>

      {!closed && (
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="ticketId" value={ticketId} />
          <textarea
            name="content"
            required
            rows={4}
            placeholder="Ваш ответ"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm"
          />
          <FormActionError error={state.error} className="text-sm text-red-600" />
          {state.success && (
            <p className="text-sm text-green-700">Сообщение отправлено</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {pending ? "Отправка…" : "Отправить"}
          </button>
        </form>
      )}
    </div>
  );
}
