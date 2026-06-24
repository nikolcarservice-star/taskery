"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminSendBroadcast,
  type BroadcastActionState,
  type BroadcastAudience,
} from "@/lib/actions/admin-broadcast";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: BroadcastActionState = {};

type AdminBroadcastPanelProps = {
  stats: {
    freelancers: number;
    clients: number;
  };
  locale: AppLocale;
  compact?: boolean;
};

function audienceHint(
  audience: BroadcastAudience,
  stats: AdminBroadcastPanelProps["stats"],
  locale: AppLocale,
): string {
  const b = getAdminCopy(locale).panels.broadcast;

  switch (audience) {
    case "ALL":
      return `≈ ${stats.freelancers + stats.clients} ${b.audienceAllHint}`;
    case "FREELANCERS":
      return `≈ ${stats.freelancers} ${b.audienceFreelancersHint}`;
    case "CLIENTS":
      return `≈ ${stats.clients} ${b.audienceClientsHint}`;
  }
}

export function AdminBroadcastPanel({
  stats,
  locale,
  compact = false,
}: AdminBroadcastPanelProps) {
  const b = getAdminCopy(locale).panels.broadcast;
  const [state, formAction, pending] = useActionState(
    adminSendBroadcast,
    initialState,
  );

  const audienceOptions: {
    value: BroadcastAudience;
    label: string;
  }[] = [
    { value: "ALL", label: b.audienceAll },
    { value: "FREELANCERS", label: b.audienceFreelancers },
    { value: "CLIENTS", label: b.audienceClients },
  ];

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">{b.title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{b.description}</p>

      <form action={formAction} className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            {b.audience}
          </label>
          <select
            name="audience"
            required
            defaultValue="ALL"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {audienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({audienceHint(option.value, stats, locale)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            {b.titleLabel}
          </label>
          <input
            name="title"
            required
            maxLength={120}
            placeholder={b.titlePlaceholder}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            {b.bodyLabel}
          </label>
          <textarea
            name="body"
            required
            rows={4}
            maxLength={2000}
            placeholder={b.bodyPlaceholder}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            {b.linkLabel}
          </label>
          <input
            name="link"
            type="text"
            placeholder={b.linkPlaceholder}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-zinc-500">{b.linkHint}</p>
        </div>

        <label className="flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="confirm"
            required
            className="mt-1 rounded border-zinc-300"
          />
          <span>{b.confirmCheckbox}</span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? b.sending : b.send}
        </button>

        <AdminActionError error={state.error} locale={locale} className="text-sm text-red-600" />
        {state.success && (
          <p className="text-sm text-green-700">
            {b.sentSuccess}{" "}
            {state.recipientCount
              ? `${state.recipientCount} ${b.recipientsSuffix}`
              : ""}
          </p>
        )}
      </form>
    </section>
  );
}
