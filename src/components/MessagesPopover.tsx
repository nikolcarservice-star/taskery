"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime, unreadShort } from "@/lib/i18n/relative-time";
import type { MessagePreviewItem } from "@/lib/messages-shared";
import Link from "next/link";

type MessagesPopoverProps = {
  messages: MessagePreviewItem[];
  unreadCount: number;
};

export function MessagesPopover({
  messages,
  unreadCount,
}: MessagesPopoverProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const p = dict.popovers.messages;

  return (
    <div
      role="dialog"
      aria-label={p.title}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
    >
      <div className="border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-zinc-900">{p.title}</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              {unreadShort(unreadCount, dict.popovers.unreadShort)}
            </span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm font-medium text-zinc-900">{p.emptyTitle}</p>
          <p className="mt-1.5 text-sm leading-6 text-zinc-600">{p.emptyBody}</p>
        </div>
      ) : (
        <ul className="max-h-[320px] overflow-y-auto">
          {messages.map((item) => {
            const isUnread = item.unreadCount > 0;

            return (
              <li
                key={item.id}
                className="border-b border-zinc-50 last:border-0"
              >
                <Link
                  href={l(item.link.startsWith("/") ? item.link : `/${item.link}`)}
                  className={`block px-4 py-3 transition-colors hover:bg-indigo-50/50 ${
                    isUnread ? "bg-indigo-50/30" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug text-zinc-900">
                      {item.partnerName ?? p.participant}
                    </p>
                    {isUnread && (
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs font-medium text-indigo-600">
                    {item.projectTitle}
                  </p>
                  {item.preview && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
                      {item.preview}
                    </p>
                  )}
                  <p className="mt-1.5 text-[11px] text-zinc-400">
                    {formatRelativeTime(new Date(item.createdAt), dict.time)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <Link
          href={l("/messages")}
          className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          {p.viewAll}
        </Link>
      </div>
    </div>
  );
}
