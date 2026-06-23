"use client";

import {
  adminDismissContactWarning,
  type ModerationActionState,
} from "@/lib/actions/admin-moderation";
import { useActionState } from "react";

const initialState: ModerationActionState = {};

type AdminAttentionDismissButtonProps = {
  attentionItemId: string;
};

export function AdminAttentionDismissButton({
  attentionItemId,
}: AdminAttentionDismissButtonProps) {
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
        title="Скрыть уведомление только у вас"
      >
        {pending ? "…" : "Скрыть"}
      </button>
      {state.error && (
        <span className="sr-only" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}
