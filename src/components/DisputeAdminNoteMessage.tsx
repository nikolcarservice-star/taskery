"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";

type DisputeAdminNoteMessageProps = {
  openedByName: string;
  content: string;
  createdAt: Date;
};

export function DisputeAdminNoteMessage({
  openedByName,
  content,
  createdAt,
}: DisputeAdminNoteMessageProps) {
  const dict = useDictionary();
  const t = dict.inbox.dispute;

  return (
    <div className="mx-auto w-full max-w-xl py-1">
      <div className="rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 shadow-sm">
        <p className="font-semibold text-zinc-800">{t.adminNoteTitle}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {t.adminNoteFrom.replace("{name}", openedByName)}
        </p>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{content}</p>
        <time
          dateTime={createdAt.toISOString()}
          className="mt-2 block text-xs text-zinc-500"
        >
          {formatRelativeTime(createdAt, dict.time)}
        </time>
      </div>
    </div>
  );
}
