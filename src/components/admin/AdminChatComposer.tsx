"use client";

import { FormActionError } from "@/components/FormActionError";
import {
  sendAdminBidMessage,
  sendAdminConversationMessage,
  type AdminMessageActionState,
} from "@/lib/actions/admin-messages";
import { useActionState, useEffect, useRef } from "react";

type AdminChatComposerProps = {
  mode: "conversation" | "bid";
  targetId: string;
};

const initialState: AdminMessageActionState = {};

export function AdminChatComposer({ mode, targetId }: AdminChatComposerProps) {
  const action =
    mode === "conversation" ? sendAdminConversationMessage : sendAdminBidMessage;
  const [state, formAction, pending] = useActionState(action, initialState);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.success) {
      const form = textareaRef.current?.form;
      if (form) form.reset();
      textareaRef.current?.focus();
    }
  }, [state.success]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form action={formAction} className="border-t border-zinc-200 bg-white p-4 sm:p-5">
      {mode === "conversation" ? (
        <input type="hidden" name="conversationId" value={targetId} />
      ) : (
        <input type="hidden" name="bidId" value={targetId} />
      )}

      <label htmlFor="admin-chat-content" className="sr-only">
        Сообщение от администратора
      </label>
      <textarea
        ref={textareaRef}
        id="admin-chat-content"
        name="content"
        required
        rows={3}
        placeholder="Напишите участникам от имени администратора Taskery…"
        onKeyDown={handleKeyDown}
        className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-red-300 focus:ring-2 focus:ring-red-500/15"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Сообщение будет видно заказчику и исполнителю с вашим именем
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Отправка…" : "Отправить"}
        </button>
      </div>

      <FormActionError error={state.error} className="mt-2 text-sm text-red-600" />
    </form>
  );
}
