"use client";

import { MessagesPopover } from "@/components/MessagesPopover";
import { NavPopoverAnchor } from "@/components/NavPopoverAnchor";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { headerIconButtonClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { MessagePreviewItem } from "@/lib/messages-shared";
import Link from "next/link";

type MessagesNavButtonProps = {
  messages: MessagePreviewItem[];
  unreadCount: number;
};

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.784 9.784 0 0 1-2.555-.337A6.978 6.978 0 0 1 3 21V9.75c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  );
}

export function MessagesNavButton({
  messages,
  unreadCount,
}: MessagesNavButtonProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <NavPopoverAnchor
      toggleOnClick={false}
      panel={<MessagesPopover messages={messages} unreadCount={unreadCount} />}
    >
      <Link
        href={l("/messages")}
        className={`${headerIconButtonClass} relative inline-flex`}
        aria-label={
          unreadCount > 0
            ? dict.header.messagesUnread.replace("{count}", String(unreadCount))
            : dict.header.messages
        }
      >
        <MessageIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
    </NavPopoverAnchor>
  );
}
