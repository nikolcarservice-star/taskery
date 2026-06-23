"use client";

import { hideConversations, type ActionState } from "@/lib/actions/messages";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useActionState, useEffect } from "react";

const initialState: ActionState = {};

type DeleteConversationsButtonProps = {
  conversationIds: string[];
  label?: string;
  redirectTo?: string;
  className?: string;
  onSuccess?: () => void;
};

export function DeleteConversationsButton({
  conversationIds,
  label,
  redirectTo,
  className = "",
  onSuccess,
}: DeleteConversationsButtonProps) {
  const dict = useDictionary();
  const inbox = dict.inbox;
  const buttonLabel = label ?? inbox.delete;
  const [state, formAction, pending] = useActionState(
    hideConversations,
    initialState,
  );

  useEffect(() => {
    if (state.success && !redirectTo) {
      onSuccess?.();
    }
  }, [state.success, redirectTo, onSuccess]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const count = conversationIds.length;
    const message =
      count === 1
        ? inbox.deleteConfirmOne
        : inbox.deleteConfirmMany.replace("{count}", String(count));

    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className={className}>
      {conversationIds.map((id) => (
        <input key={id} type="hidden" name="conversationIds" value={id} />
      ))}
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      <button
        type="submit"
        disabled={pending || conversationIds.length === 0}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        {pending ? inbox.deleting : buttonLabel}
      </button>
      <FormActionError error={state.error} className="mt-2 text-sm text-red-600" />
    </form>
  );
}
