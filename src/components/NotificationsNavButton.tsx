"use client";

import { NotificationsPopover } from "@/components/NotificationsPopover";
import { headerIconButtonClass } from "@/components/HeaderShell";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import type { NotificationItem } from "@/lib/notifications-shared";
import { useCallback, useEffect, useRef, useState } from "react";

type NotificationsNavButtonProps = {
  notifications: NotificationItem[];
  unreadCount: number;
  variant?: "client" | "freelancer";
};

const CLOSE_DELAY_MS = 200;

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

export function NotificationsNavButton({
  notifications,
  unreadCount,
  variant = "freelancer",
}: NotificationsNavButtonProps) {
  const dict = useDictionary();
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
      <button
        type="button"
        className={`${headerIconButtonClass} relative`}
        aria-label={
          unreadCount > 0
            ? dict.header.notificationsUnread.replace("{count}", String(unreadCount))
            : dict.header.notifications
        }
        aria-expanded={hoverOpen}
        onMouseEnter={openPopover}
        onMouseLeave={scheduleClose}
        onFocus={openPopover}
        onBlur={scheduleClose}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {hoverOpen && (
        <div
          className="absolute right-0 top-full z-[60] w-[min(360px,calc(100vw-2rem))] pt-2"
          onMouseEnter={openPopover}
          onMouseLeave={scheduleClose}
        >
          <NotificationsPopover
            notifications={notifications}
            unreadCount={unreadCount}
            variant={variant}
          />
        </div>
      )}
    </div>
  );
}
