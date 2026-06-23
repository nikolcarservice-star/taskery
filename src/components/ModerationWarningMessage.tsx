"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";

type ModerationWarningMessageProps = {
  violationUserName: string;
};

export function ModerationWarningMessage({
  violationUserName,
}: ModerationWarningMessageProps) {
  const dict = useDictionary();
  const t = dict.inbox.moderation;

  return (
    <div className="mx-auto w-full max-w-xl py-1">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm">
        <p className="font-semibold text-amber-900">{t.adminLabel}</p>
        <p className="mt-1.5 leading-relaxed">
          {t.externalContactBlocked.replace("{name}", violationUserName)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-amber-800">{t.policyHint}</p>
      </div>
    </div>
  );
}
