"use client";

import { playMessageNotificationSound } from "@/lib/message-sound";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type MessageSoundWatcherProps = {
  enabled: boolean;
  initialUnreadCount: number;
  initialNotificationCount?: number;
  pollMs?: number;
};

export function MessageSoundWatcher({
  enabled,
  initialUnreadCount,
  initialNotificationCount = 0,
  pollMs = 20_000,
}: MessageSoundWatcherProps) {
  const router = useRouter();
  const lastMessagesRef = useRef(initialUnreadCount);
  const lastNotificationsRef = useRef(initialNotificationCount);
  const initializedRef = useRef(false);

  useEffect(() => {
    lastMessagesRef.current = initialUnreadCount;
  }, [initialUnreadCount]);

  useEffect(() => {
    lastNotificationsRef.current = initialNotificationCount;
  }, [initialNotificationCount]);

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
          count?: number;
          messages?: number;
          notifications?: number;
        };
        const messages = data.messages ?? data.count ?? 0;
        const notifications = data.notifications ?? 0;

        if (!initializedRef.current) {
          initializedRef.current = true;
          lastMessagesRef.current = messages;
          lastNotificationsRef.current = notifications;
          return;
        }

        const messagesIncreased = messages > lastMessagesRef.current;
        const inboxChanged =
          messages !== lastMessagesRef.current ||
          notifications !== lastNotificationsRef.current;

        if (messagesIncreased && enabled) {
          playMessageNotificationSound();
        }

        if (inboxChanged) {
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
  }, [enabled, pollMs, router]);

  return null;
}
