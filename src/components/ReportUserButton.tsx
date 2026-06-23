"use client";

import { ReportDialog } from "@/components/ReportDialog";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useState } from "react";

type ReportUserButtonProps = {
  userId: string;
  canReport: boolean;
  alreadyReported: boolean;
};

export function ReportUserButton({
  userId,
  canReport,
  alreadyReported,
}: ReportUserButtonProps) {
  const dict = useDictionary();
  const t = dict.reports;
  const [open, setOpen] = useState(false);

  if (!canReport) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={alreadyReported}
        className={`text-sm font-medium ${
          alreadyReported
            ? "cursor-not-allowed text-zinc-400"
            : "text-red-600 hover:text-red-700 hover:underline"
        }`}
      >
        {alreadyReported ? t.alreadyReported : t.reportUser}
      </button>

      <ReportDialog
        open={open}
        onClose={() => setOpen(false)}
        targetType="USER"
        targetUserId={userId}
      />
    </>
  );
}
