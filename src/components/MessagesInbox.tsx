"use client";

import { DeleteConversationsButton } from "@/components/DeleteConversationsButton";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { UserAvatar } from "@/components/UserAvatar";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { unreadShort } from "@/lib/i18n/relative-time";
import { projectStatusColors } from "@/lib/project-labels";
import type { ProjectStatus } from "@/generated/prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ConversationRow = {
  id: string;
  partner: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  project: {
    title: string;
    slug: string;
    status: ProjectStatus;
  };
  messageCount: number;
  unreadCount: number;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
};

type MessagesInboxProps = {
  conversations: ConversationRow[];
};

function formatSentAt(iso: string, locale: string) {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
  });
  const timePart = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}

export function MessagesInbox({ conversations }: MessagesInboxProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const t = dict.inbox;
  const projectStatusLabels = dict.labels.projectStatus;
  const l = useLocalizedPath();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;

    return conversations.filter((conv) => {
      const haystack = [
        conv.partner.name,
        conv.project.title,
        conv.lastMessagePreview,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [conversations, query]);

  const allSelected =
    filtered.length > 0 && filtered.every((conv) => selected.has(conv.id));

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filtered.map((conv) => conv.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (conversations.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center">
        <p className="text-lg font-semibold text-zinc-900">{t.emptyTitle}</p>
        <p className="mt-2 text-sm text-zinc-500">{t.emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {selected.size > 0 && (
          <DeleteConversationsButton
            conversationIds={[...selected]}
            label={t.deleteSelected.replace("{count}", String(selected.size))}
            onSuccess={() => setSelected(new Set())}
          />
        )}
        <div className="relative min-w-0 flex-1 sm:max-w-md sm:ml-auto">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-10 text-sm text-zinc-800 shadow-sm outline-none transition-colors placeholder:text-zinc-400 hover:border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 space-y-2 lg:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
            {t.noResults.replace("{query}", query)}
          </div>
        ) : (
          filtered.map((conv) => (
            <Link
              key={conv.id}
              href={l(`/messages/${conv.id}`)}
              className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors active:bg-indigo-50/40"
            >
              <UserAvatar
                name={conv.partner.name}
                avatar={conv.partner.avatar}
                size="sm"
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-zinc-900">
                    {conv.partner.name ?? dict.labels.participant}
                  </p>
                  {conv.unreadCount > 0 ? (
                    <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-sm font-medium text-indigo-600">
                  {conv.project.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {conv.lastMessagePreview ?? "…"}
                </p>
                {conv.lastMessageAt ? (
                  <p className="mt-2 text-xs text-zinc-400">
                    {formatSentAt(conv.lastMessageAt, locale)}
                  </p>
                ) : null}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/90 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3.5">{t.sender}</th>
                <th className="px-5 py-3.5">{t.subject}</th>
                <th className="px-5 py-3.5">{t.messageCount}</th>
                <th className="px-5 py-3.5">{t.sent}</th>
                <th className="w-12 px-3 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label={t.selectAll}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-zinc-500"
                  >
                    {t.noResults.replace("{query}", query)}
                  </td>
                </tr>
              ) : (
                filtered.map((conv, index) => (
                  <tr
                    key={conv.id}
                    className={`border-b border-zinc-100 transition-colors hover:bg-indigo-50/40 ${
                      index % 2 === 1 ? "bg-zinc-50/50" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          name={conv.partner.name}
                          avatar={conv.partner.avatar}
                          size="sm"
                          className="mt-0.5"
                        />
                        <div className="min-w-0">
                          <Link
                            href={l(`/messages/${conv.id}`)}
                            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            {conv.partner.name ?? dict.labels.participant}
                          </Link>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span
                              title={t.conversation}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-500"
                            >
                              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                              </svg>
                            </span>
                            <Link
                              href={l(`/projects/${conv.project.slug}`)}
                              title={projectStatusLabels[conv.project.status]}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"
                            >
                              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25m12 0v-4.25c0-.414-.336-.75-.75-.75h-4.5a.75.75 0 0 0-.75.75v4.25m0 0H3.75M12 3v12.75" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={l(`/messages/${conv.id}`)}
                        className="block max-w-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline sm:max-w-md"
                      >
                        {conv.project.title}
                      </Link>
                      {conv.lastMessagePreview && (
                        <p className="mt-1 line-clamp-1 max-w-md text-xs text-zinc-500">
                          {conv.lastMessagePreview}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-zinc-700 px-2.5 py-1 text-xs font-semibold tabular-nums text-white">
                          {conv.messageCount}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                            {unreadShort(conv.unreadCount, t.unreadShort)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-zinc-600">
                      {conv.lastMessageAt
                        ? formatSentAt(conv.lastMessageAt, locale)
                        : "—"}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(conv.id)}
                        onChange={() => toggleOne(conv.id)}
                        aria-label={t.selectConversation.replace(
                          "{name}",
                          conv.partner.name ?? dict.labels.participant,
                        )}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
