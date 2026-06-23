"use client";

import { DisputeAdminNoteMessage } from "@/components/DisputeAdminNoteMessage";
import { DisputeOpenedMessage } from "@/components/DisputeOpenedMessage";
import { DisputeReasonMessage } from "@/components/DisputeReasonMessage";
import { MessageContent } from "@/components/MessageContent";
import { ModerationWarningMessage } from "@/components/ModerationWarningMessage";
import { UserAvatar } from "@/components/UserAvatar";
import type { AdminReviewMessage } from "@/lib/admin-review-types";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";

type AdminChatReviewThreadProps = {
  messages: AdminReviewMessage[];
  adminId: string;
  participants: {
    client: { id: string; name: string | null; avatar?: string | null };
    freelancer: { id: string; name: string | null; avatar?: string | null };
  };
};

export function AdminChatReviewThread({
  messages,
  adminId,
  participants,
}: AdminChatReviewThreadProps) {
  const dict = useDictionary();
  const t = dict.inbox.thread;

  const nameById = new Map<string, string | null>([
    [participants.client.id, participants.client.name],
    [participants.freelancer.id, participants.freelancer.name],
  ]);

  const avatarById = new Map<string, string | null | undefined>([
    [participants.client.id, participants.client.avatar],
    [participants.freelancer.id, participants.freelancer.avatar],
  ]);

  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        Сообщений в переписке пока нет. Вы можете написать первым от имени
        администратора.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        if (msg.kind === "EXTERNAL_CONTACT_WARNING") {
          const offenderName =
            msg.violationUser?.name ?? msg.violationUser?.id ?? t.participant;

          return (
            <div key={msg.id} className="space-y-2">
              <ModerationWarningMessage violationUserName={offenderName} />
              {msg.blockedSnippet && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                  Заблокированный текст: «{msg.blockedSnippet}»
                </p>
              )}
            </div>
          );
        }

        if (msg.kind === "DISPUTE_OPENED" && msg.sender) {
          const openedByName =
            msg.sender.name ?? nameById.get(msg.sender.id) ?? t.participant;

          return (
            <DisputeOpenedMessage
              key={msg.id}
              openedByName={openedByName}
              openedByCurrentUser={false}
              createdAt={new Date(msg.createdAt)}
            />
          );
        }

        if (msg.kind === "DISPUTE_REASON" && msg.sender) {
          const openedByName =
            msg.sender.name ?? nameById.get(msg.sender.id) ?? t.participant;

          return (
            <DisputeReasonMessage
              key={msg.id}
              openedByName={openedByName}
              content={msg.content}
              createdAt={new Date(msg.createdAt)}
            />
          );
        }

        if (msg.kind === "DISPUTE_ADMIN_NOTE" && msg.sender) {
          const openedByName =
            msg.sender.name ?? nameById.get(msg.sender.id) ?? t.participant;

          return (
            <DisputeAdminNoteMessage
              key={msg.id}
              openedByName={openedByName}
              content={msg.content}
              createdAt={new Date(msg.createdAt)}
            />
          );
        }

        if (msg.kind !== "USER") return null;

        if (!msg.sender) return null;

        const isAdminMessage = msg.sender.id === adminId;
        const senderName =
          msg.sender.name ??
          nameById.get(msg.sender.id) ??
          (isAdminMessage ? "Администратор" : t.participant);
        const prev = messages[index - 1];
        const showAvatar =
          !prev ||
          prev.kind !== "USER" ||
          !prev.sender ||
          prev.sender.id !== msg.sender.id;

        return (
          <div key={msg.id} className="flex gap-3">
            <div className="w-9 shrink-0">
              {showAvatar ? (
                <UserAvatar
                  name={senderName}
                  avatar={msg.sender.avatar ?? avatarById.get(msg.sender.id)}
                  size="sm"
                />
              ) : (
                <div className="h-9" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {showAvatar && (
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium text-zinc-500">{senderName}</p>
                  {isAdminMessage && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">
                      Администратор
                    </span>
                  )}
                </div>
              )}
              <div
                className={`rounded-2xl rounded-tl-md px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  isAdminMessage
                    ? "border border-red-200 bg-red-50 text-red-950"
                    : "border border-zinc-100 bg-white text-zinc-900"
                }`}
              >
                <MessageContent content={msg.content} warnExternalLinks />
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
  );
}
