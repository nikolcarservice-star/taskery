"use client";

import { DisputeOpenedMessage } from "@/components/DisputeOpenedMessage";
import { DisputeReasonMessage } from "@/components/DisputeReasonMessage";
import { FormActionError } from "@/components/FormActionError";
import { MessageContent } from "@/components/MessageContent";
import { ModerationWarningMessage } from "@/components/ModerationWarningMessage";
import { OpenDisputeButton } from "@/components/OpenDisputeButton";
import { UserAvatar } from "@/components/UserAvatar";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { formatMoney } from "@/lib/i18n/currencies";
import { formatRelativeTime } from "@/lib/i18n/relative-time";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendMessage, type ActionState } from "@/lib/actions/messages";
import { requestInboxRefresh } from "@/components/inbox/inbox-events";

import type { ContractStatus, MessageKind, ProjectStatus } from "@/generated/prisma/client";

type Message = {
  id: string;
  kind: MessageKind;
  content: string;
  createdAt: Date;
  sender: { id: string; name: string | null; avatar?: string | null } | null;
  violationUser: { id: string; name: string | null } | null;
};

type MessageThreadProps = {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  participantIds: string[];
  warnExternalLinks?: boolean;
  partner: {
    name: string | null;
    avatar: string | null;
  };
  projectId?: string;
  projectStatus?: ProjectStatus;
  contractStatus?: ContractStatus | null;
  canOpenDispute?: boolean;
  freelancerPayoutBreakdown?: {
    amount: number;
    commission: number;
    payout: number;
    currency: string;
  } | null;
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
  participantIds,
  warnExternalLinks = false,
  partner,
  projectId,
  projectStatus,
  contractStatus,
  canOpenDispute = false,
  freelancerPayoutBreakdown = null,
}: MessageThreadProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const t = dict.inbox.thread;
  const disputeT = dict.inbox.dispute;
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
      requestInboxRefresh();
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
              if (msg.kind === "EXTERNAL_CONTACT_WARNING") {
                const offenderName =
                  msg.violationUser?.name ?? msg.violationUser?.id ?? t.participant;

                return (
                  <ModerationWarningMessage
                    key={msg.id}
                    violationUserName={offenderName}
                  />
                );
              }

              if (msg.kind === "DISPUTE_OPENED" && msg.sender) {
                const openedByName =
                  msg.sender.name ?? msg.sender.id ?? t.participant;

                return (
                  <DisputeOpenedMessage
                    key={msg.id}
                    openedByName={openedByName}
                    openedByCurrentUser={msg.sender.id === currentUserId}
                    createdAt={new Date(msg.createdAt)}
                  />
                );
              }

              if (msg.kind === "DISPUTE_REASON" && msg.sender && msg.content) {
                const openedByName =
                  msg.sender.name ?? msg.sender.id ?? t.participant;

                return (
                  <DisputeReasonMessage
                    key={msg.id}
                    openedByName={openedByName}
                    content={msg.content}
                    createdAt={new Date(msg.createdAt)}
                  />
                );
              }

              if (msg.kind !== "USER") return null;

              if (!msg.sender) return null;

              const isMine = msg.sender.id === currentUserId;
              const isAdminMessage =
                !isMine && !participantIds.includes(msg.sender.id);
              const prev = messages[index - 1];
              const showAvatar =
                !prev ||
                prev.kind !== "USER" ||
                !prev.sender ||
                prev.sender.id !== msg.sender.id;
              const senderName = isMine
                ? (msg.sender.name ?? t.you)
                : isAdminMessage
                  ? (msg.sender.name ?? t.adminBadge)
                  : (msg.sender.name ?? partner.name ?? t.participant);
              const senderAvatar = isMine
                ? msg.sender.avatar
                : (msg.sender.avatar ?? partner.avatar);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isMine && !isAdminMessage ? "flex-row-reverse" : "flex-row"
                  }`}
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
                    className={`flex max-w-[min(100%,28rem)] flex-col ${
                      isMine && !isAdminMessage ? "items-end" : "items-start"
                    }`}
                  >
                    {showAvatar && (
                      <div
                        className={`mb-1.5 flex flex-wrap items-center gap-2 ${
                          isMine && !isAdminMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <p className="text-xs font-medium text-zinc-500">
                          {senderName}
                        </p>
                        {isAdminMessage && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">
                            {t.adminBadge}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isAdminMessage
                          ? "rounded-tl-md border border-red-200 bg-red-50 text-red-950"
                          : isMine
                            ? "rounded-tr-md bg-indigo-600 text-white"
                            : "rounded-tl-md border border-zinc-100 bg-white text-zinc-900"
                      }`}
                    >
                      <MessageContent
                        content={msg.content}
                        warnExternalLinks={warnExternalLinks}
                        inverse={isMine && !isAdminMessage}
                      />
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
        {freelancerPayoutBreakdown && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-sm font-semibold text-emerald-900">
              {disputeT.freelancerPayoutTitle}
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-600">{disputeT.clientPays}</dt>
                <dd className="font-medium text-zinc-900">
                  {formatMoney(
                    freelancerPayoutBreakdown.amount,
                    freelancerPayoutBreakdown.currency,
                    locale,
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-600">{disputeT.platformFee}</dt>
                <dd className="font-medium text-zinc-900">
                  {formatMoney(
                    freelancerPayoutBreakdown.commission,
                    freelancerPayoutBreakdown.currency,
                    locale,
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-emerald-100 pt-2">
                <dt className="font-medium text-emerald-900">{disputeT.freelancerReceives}</dt>
                <dd className="text-base font-bold text-emerald-800">
                  {formatMoney(
                    freelancerPayoutBreakdown.payout,
                    freelancerPayoutBreakdown.currency,
                    locale,
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {canOpenDispute && projectId && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
            <p className="text-sm text-red-900">{disputeT.openHint}</p>
            <OpenDisputeButton projectId={projectId} />
          </div>
        )}

        {projectStatus === "UNDER_DISPUTE" && contractStatus === "ESCROWED" && (
          <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            {disputeT.activeNotice}
          </p>
        )}

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

            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-4 py-3">
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
