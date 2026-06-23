"use client";

import { MessageContent } from "@/components/MessageContent";
import { ModerationWarningMessage } from "@/components/ModerationWarningMessage";
import { UserAvatar } from "@/components/UserAvatar";
import type { AdminReviewMessage } from "@/lib/admin-review";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";

type AdminChatReviewThreadProps = {
  messages: AdminReviewMessage[];
  participants: {
    client: { id: string; name: string | null; avatar?: string | null };
    freelancer: { id: string; name: string | null; avatar?: string | null };
  };
};

export function AdminChatReviewThread({
  messages,
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
        Сообщений в переписке пока нет
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

        if (!msg.sender) return null;

        const senderName =
          msg.sender.name ??
          nameById.get(msg.sender.id) ??
          t.participant;
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
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  {senderName}
                </p>
              )}
              <div className="rounded-2xl rounded-tl-md border border-zinc-100 bg-white px-4 py-2.5 text-sm leading-relaxed text-zinc-900 shadow-sm">
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
