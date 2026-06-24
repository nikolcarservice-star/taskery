"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminDismissContactWarning,
  type ModerationActionState,
} from "@/lib/actions/admin-moderation";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: ModerationActionState = {};

type AdminAttentionDismissButtonProps = {
  attentionItemId: string;
  locale: AppLocale;
};

export function AdminAttentionDismissButton({
  attentionItemId,
  locale,
}: AdminAttentionDismissButtonProps) {
  const copy = getAdminCopy(locale).attention;
  const [state, action, pending] = useActionState(
    adminDismissContactWarning,
    initialState,
  );

  return (
    <form action={action} className="shrink-0">
      <input type="hidden" name="attentionItemId" value={attentionItemId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
        title={copy.dismissTitle}
      >
        {pending ? "…" : copy.dismiss}
      </button>
      <AdminActionError
        error={state.error}
        locale={locale}
        className="sr-only"
      />
    </form>
  );
}
