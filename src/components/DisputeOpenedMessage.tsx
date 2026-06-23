"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";

type DisputeOpenedMessageProps = {
  openedByName: string;
  openedByCurrentUser: boolean;
  createdAt: Date;
};

export function DisputeOpenedMessage({
  openedByName,
  openedByCurrentUser,
  createdAt,
}: DisputeOpenedMessageProps) {
  const dict = useDictionary();
  const t = dict.inbox.dispute;

  return (
    <div className="mx-auto w-full max-w-xl py-1">
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950 shadow-sm">
        <p className="font-semibold text-red-900">{t.openedTitle}</p>
        <p className="mt-1.5 leading-relaxed">
          {openedByCurrentUser
            ? t.openedByYou
            : t.openedBy.replace("{name}", openedByName)}
        </p>
        <time
          dateTime={createdAt.toISOString()}
          className="mt-2 block text-xs text-red-800/80"
        >
          {formatRelativeTime(createdAt, dict.time)}
        </time>
      </div>
    </div>
  );
}
