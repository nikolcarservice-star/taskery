"use client";

import { UserAvatar } from "@/components/UserAvatar";
import { DeleteConversationsButton } from "@/components/DeleteConversationsButton";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

type ConversationHeaderProps = {
  conversationId: string;
  projectTitle: string;
  projectSlug: string;
  partnerName: string | null;
  partnerAvatar: string | null;
  messageCount: number;
};

function HeaderAction({
  label,
  href,
  children,
}: {
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" className={className} title={label}>
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function ConversationHeader({
  conversationId,
  projectTitle,
  projectSlug,
  partnerName,
  partnerAvatar,
  messageCount,
}: ConversationHeaderProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const inbox = dict.inbox;

  return (
    <header className="border-b border-zinc-200 bg-zinc-50/80 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={l(`/projects/${projectSlug}`)}
              className="text-xl font-bold text-zinc-900 transition-colors hover:text-indigo-600 sm:text-2xl"
            >
              {projectTitle}
            </Link>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-2 text-xs font-semibold tabular-nums text-white">
              {messageCount}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2.5">
            <UserAvatar
              name={partnerName}
              avatar={partnerAvatar}
              size="sm"
              className="h-7 w-7 text-xs"
            />
            <p className="text-sm text-zinc-600">
              {inbox.chatWith}{" "}
              <span className="font-medium text-zinc-800">
                {partnerName ?? inbox.participantFallback}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-0.5">
          <HeaderAction label={inbox.allConversations} href={l("/messages")}>
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </HeaderAction>
          <HeaderAction label={inbox.bookmarks}>
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </HeaderAction>
          <HeaderAction label={inbox.projectLink} href={l(`/projects/${projectSlug}`)}>
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25m12 0v-4.25c0-.414-.336-.75-.75-.75h-4.5a.75.75 0 0 0-.75.75v4.25m0 0H3.75M12 3v12.75" />
            </svg>
          </HeaderAction>
          <DeleteConversationsButton
            conversationIds={[conversationId]}
            label={inbox.deleteConversation}
            redirectTo={l("/messages")}
          />
        </div>
      </div>
    </header>
  );
}
