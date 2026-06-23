"use client";

import { MessagesPopover } from "@/components/MessagesPopover";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { headerIconButtonClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { MessagePreviewItem } from "@/lib/messages-shared";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type MessagesNavButtonProps = {
  messages: MessagePreviewItem[];
  unreadCount: number;
};

const CLOSE_DELAY_MS = 200;

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
  const [hoverOpen, setHoverOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPopover = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setHoverOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setHoverOpen(false);
    }, CLOSE_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <Link
        href={l("/messages")}
        className={`${headerIconButtonClass} relative inline-flex`}
        aria-label={
          unreadCount > 0
            ? dict.header.messagesUnread.replace("{count}", String(unreadCount))
            : dict.header.messages
        }
        aria-expanded={hoverOpen}
        onMouseEnter={openPopover}
        onMouseLeave={scheduleClose}
        onFocus={openPopover}
        onBlur={scheduleClose}
      >
        <MessageIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      {hoverOpen && (
        <div
          className="absolute right-0 top-full z-[60] w-[min(360px,calc(100vw-2rem))] pt-2"
          onMouseEnter={openPopover}
          onMouseLeave={scheduleClose}
        >
          <MessagesPopover messages={messages} unreadCount={unreadCount} />
        </div>
      )}
    </div>
  );
}
