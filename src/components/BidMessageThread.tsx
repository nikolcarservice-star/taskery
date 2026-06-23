"use client";

import { UserAvatar } from "@/components/UserAvatar";
import { FormActionError } from "@/components/FormActionError";
import { sendBidMessage, type ActionState } from "@/lib/actions/bid-messages";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";
import { useActionState, useEffect, useRef, useState } from "react";

type BidMessage = {
  id: string;
  content: string;
  createdAt: Date;
  sender: { id: string; name: string | null; avatar?: string | null };
};

type BidMessageThreadProps = {
  bidId: string;
  messages: BidMessage[];
  currentUserId: string;
  partner: {
    name: string | null;
    avatar: string | null;
  };
  defaultOpen?: boolean;
};

const initialState: ActionState = {};

export function BidMessageThread({
  bidId,
  messages,
  currentUserId,
  partner,
  defaultOpen = false,
}: BidMessageThreadProps) {
  const dict = useDictionary();
  const t = dict.inbox.bidThread;
  const thread = dict.inbox.thread;
  const [open, setOpen] = useState(defaultOpen || messages.length > 0);
  const [state, formAction, pending] = useActionState(sendBidMessage, initialState);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, state.success, open]);

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
    <div className="mt-4 border-t border-zinc-200/80 pt-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
      >
        <svg
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        {messages.length > 0
          ? t.toggleWithCount.replace("{count}", String(messages.length))
          : t.toggleWrite}
      </button>

      {open && (
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="max-h-64 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">{t.emptyBody}</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.sender.id === currentUserId;
                  const senderName = isMine
                    ? (msg.sender.name ?? thread.you)
                    : (msg.sender.name ?? partner.name ?? thread.participant);

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <UserAvatar
                        name={senderName}
                        avatar={isMine ? msg.sender.avatar : (msg.sender.avatar ?? partner.avatar)}
                        size="sm"
                      />
                      <div
                        className={`max-w-[min(100%,20rem)] ${isMine ? "text-right" : "text-left"}`}
                      >
                        <p className="text-xs font-medium text-zinc-500">{senderName}</p>
                        <div
                          className={`mt-1 rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            isMine
                              ? "rounded-tr-md bg-indigo-600 text-white"
                              : "rounded-tl-md border border-zinc-100 bg-zinc-50 text-zinc-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <time
                          dateTime={new Date(msg.createdAt).toISOString()}
                          className="mt-1 block text-xs text-zinc-400"
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

          <form action={formAction} className="border-t border-zinc-100 p-3">
            <input type="hidden" name="bidId" value={bidId} />
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                name="content"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                required
                rows={2}
                placeholder={t.placeholder}
                className="min-h-[2.75rem] flex-1 resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
              />
              <button
                type="submit"
                disabled={pending || !draft.trim()}
                className="shrink-0 self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? t.sending : t.send}
              </button>
            </div>
            <FormActionError error={state.error} className="mt-2 text-sm text-red-600" />
          </form>
        </div>
      )}
    </div>
  );
}
