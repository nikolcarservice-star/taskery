"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";

type DisputeReasonMessageProps = {
  openedByName: string;
  content: string;
  createdAt: Date;
};

export function DisputeReasonMessage({
  openedByName,
  content,
  createdAt,
}: DisputeReasonMessageProps) {
  const dict = useDictionary();
  const t = dict.inbox.dispute;

  return (
    <div className="mx-auto w-full max-w-xl py-1">
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950 shadow-sm">
        <p className="font-semibold text-red-900">{t.reasonTitle}</p>
        <p className="mt-1 text-xs text-red-700">
          {t.reasonFrom.replace("{name}", openedByName)}
        </p>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{content}</p>
        <time
          dateTime={createdAt.toISOString()}
          className="mt-2 block text-xs text-red-600"
        >
          {formatRelativeTime(createdAt, dict.time)}
        </time>
      </div>
    </div>
  );
}
