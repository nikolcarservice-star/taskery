"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type InboxRefreshPollerProps = {
  initialMessages: number;
  initialNotifications: number;
  pollMs?: number;
};

export function InboxRefreshPoller({
  initialMessages,
  initialNotifications,
  pollMs = 20_000,
}: InboxRefreshPollerProps) {
  const router = useRouter();
  const lastMessagesRef = useRef(initialMessages);
  const lastNotificationsRef = useRef(initialNotifications);
  const initializedRef = useRef(false);

  useEffect(() => {
    lastMessagesRef.current = initialMessages;
  }, [initialMessages]);

  useEffect(() => {
    lastNotificationsRef.current = initialNotifications;
  }, [initialNotifications]);

  useEffect(() => {
    const poll = async () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      try {
        const response = await fetch("/api/inbox/unread-count", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as {
          messages?: number;
          notifications?: number;
          count?: number;
        };
        const messages = data.messages ?? data.count ?? 0;
        const notifications = data.notifications ?? 0;

        if (!initializedRef.current) {
          initializedRef.current = true;
          lastMessagesRef.current = messages;
          lastNotificationsRef.current = notifications;
          return;
        }

        if (
          messages !== lastMessagesRef.current ||
          notifications !== lastNotificationsRef.current
        ) {
          router.refresh();
        }

        lastMessagesRef.current = messages;
        lastNotificationsRef.current = notifications;
      } catch {
        // Ignore transient network errors.
      }
    };

    const intervalId = window.setInterval(() => {
      void poll();
    }, pollMs);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void poll();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pollMs, router]);

  return null;
}
