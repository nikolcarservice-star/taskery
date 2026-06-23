"use client";

import { UserAvatar } from "@/components/UserAvatar";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendMessage, type ActionState } from "@/lib/actions/messages";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  sender: { id: string; name: string | null; avatar?: string | null };
};

type MessageThreadProps = {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  partner: {
    name: string | null;
    avatar: string | null;
  };
};

const initialState: ActionState = {};

function ComposerToolbarButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
    >
      {children}
    </button>
  );
}

export function MessageThread({
  conversationId,
  messages,
  currentUserId,
  partner,
}: MessageThreadProps) {
  const dict = useDictionary();
  const t = dict.inbox.thread;
  const common = dict.cabinetForms.common;
  const [state, formAction, pending] = useActionState(sendMessage, initialState);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, state.success]);

  useEffect(() => {
    if (state.success) {
      setDraft("");
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
    <div className="flex min-h-[520px] flex-col">
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-50/50 to-white px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <p className="mt-4 text-base font-medium text-zinc-800">{t.emptyTitle}</p>
            <p className="mt-1 max-w-xs text-sm text-zinc-500">{t.emptyBody}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg, index) => {
              const isMine = msg.sender.id === currentUserId;
              const prev = messages[index - 1];
              const showAvatar = !prev || prev.sender.id !== msg.sender.id;
              const senderName = isMine
                ? (msg.sender.name ?? t.you)
                : (msg.sender.name ?? partner.name ?? t.participant);
              const senderAvatar = isMine
                ? msg.sender.avatar
                : (msg.sender.avatar ?? partner.avatar);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="w-9 shrink-0">
                    {showAvatar ? (
                      <UserAvatar
                        name={senderName}
                        avatar={senderAvatar}
                        size="sm"
                      />
                    ) : (
                      <div className="h-9" aria-hidden="true" />
                    )}
                  </div>

                  <div
                    className={`flex max-w-[min(100%,28rem)] flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    {showAvatar && (
                      <p
                        className={`mb-1.5 text-xs font-medium text-zinc-500 ${isMine ? "text-right" : "text-left"}`}
                      >
                        {senderName}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isMine
                          ? "rounded-tr-md bg-indigo-600 text-white"
                          : "rounded-tl-md border border-zinc-100 bg-white text-zinc-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <time
                      dateTime={new Date(msg.createdAt).toISOString()}
                      className="mt-1.5 text-xs text-zinc-400"
                    >
                      {formatRelativeTime(new Date(msg.createdAt), dict.time)}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
        <form action={formAction}>
          <input type="hidden" name="conversationId" value={conversationId} />

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15">
            <div className="flex items-center gap-0.5 border-b border-zinc-100 px-2 py-1.5">
              <ComposerToolbarButton label={common.bold}>
                <span className="text-xs font-bold">B</span>
              </ComposerToolbarButton>
              <ComposerToolbarButton label={common.italic}>
                <span className="text-xs italic">I</span>
              </ComposerToolbarButton>
              <ComposerToolbarButton label={common.list}>
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </ComposerToolbarButton>
              <ComposerToolbarButton label={common.link}>
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              </ComposerToolbarButton>
            </div>

            <textarea
              ref={textareaRef}
              name="content"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              required
              rows={3}
              placeholder={t.placeholder}
              className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
            />

            <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-indigo-600"
                title={common.soon}
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
                {t.attachFiles}
              </button>

              <button
                type="submit"
                disabled={pending || !draft.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? t.sending : t.send}
                {!pending && (
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875 5.25 5.25 0 0 1 6 12Zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <FormActionError error={state.error} className="mt-2 text-sm text-red-600" />
        </form>
      </div>
    </div>
  );
}
