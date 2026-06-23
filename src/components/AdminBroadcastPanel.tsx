"use client";

import {
  adminSendBroadcast,
  type BroadcastActionState,
  type BroadcastAudience,
} from "@/lib/actions/admin-broadcast";
import { useActionState } from "react";

const initialState: BroadcastActionState = {};

const AUDIENCE_OPTIONS: {
  value: BroadcastAudience;
  label: string;
  hint: (stats: AdminBroadcastPanelProps["stats"]) => string;
}[] = [
  {
    value: "ALL",
    label: "Все пользователи",
    hint: (stats) =>
      `≈ ${stats.freelancers + stats.clients} фрилансеров и заказчиков`,
  },
  {
    value: "FREELANCERS",
    label: "Только фрилансеры",
    hint: (stats) => `≈ ${stats.freelancers} получателей`,
  },
  {
    value: "CLIENTS",
    label: "Только заказчики",
    hint: (stats) => `≈ ${stats.clients} получателей`,
  },
];

type AdminBroadcastPanelProps = {
  stats: {
    freelancers: number;
    clients: number;
  };
  compact?: boolean;
};

export function AdminBroadcastPanel({
  stats,
  compact = false,
}: AdminBroadcastPanelProps) {
  const [state, formAction, pending] = useActionState(
    adminSendBroadcast,
    initialState,
  );

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">Рассылка</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Массовое уведомление в колокольчик пользователям платформы
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Аудитория
          </label>
          <select
            name="audience"
            required
            defaultValue="ALL"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {AUDIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.hint(stats)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Заголовок
          </label>
          <input
            name="title"
            required
            maxLength={120}
            placeholder="Обновление правил платформы"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Текст
          </label>
          <textarea
            name="body"
            required
            rows={4}
            maxLength={2000}
            placeholder="Кратко опишите, что изменилось или что важно знать"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Ссылка (необязательно)
          </label>
          <input
            name="link"
            type="text"
            placeholder="/faq или /projects"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Внутренний путь, начинающийся с /
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="confirm"
            required
            className="mt-1 rounded border-zinc-300"
          />
          <span>
            Понимаю, что уведомление получат все пользователи выбранной
            аудитории (кроме заблокированных)
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Отправка…" : "Отправить рассылку"}
        </button>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.success && (
          <p className="text-sm text-green-700">
            Рассылка отправлена{" "}
            {state.recipientCount
              ? `${state.recipientCount} пользователям`
              : ""}
          </p>
        )}
      </form>
    </section>
  );
}
