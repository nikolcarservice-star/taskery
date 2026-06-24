"use client";

import { requestInboxRefresh, INBOX_REFRESH_EVENT } from "@/components/inbox/inbox-events";
import { playMessageNotificationSound } from "@/lib/message-sound";
import type { MessagePreviewItem } from "@/lib/messages-shared";
import type { NotificationItem } from "@/lib/notifications-shared";
import { useSession } from "next-auth/react";
import { INBOX_POLL_MS } from "@/lib/inbox-poll";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type InboxChromeState = {
  unreadMessages: number;
  unreadNotifications: number;
  messages: MessagePreviewItem[];
  notifications: NotificationItem[];
  soundEnabled: boolean;
  user: { name: string | null; avatar: string | null };
  ready: boolean;
};

const emptyState: InboxChromeState = {
  unreadMessages: 0,
  unreadNotifications: 0,
  messages: [],
  notifications: [],
  soundEnabled: false,
  user: { name: null, avatar: null },
  ready: false,
};

const CabinetInboxContext = createContext<InboxChromeState>(emptyState);

export function useCabinetInbox() {
  return useContext(CabinetInboxContext);
}

export { requestInboxRefresh };

type InboxChromeResponse = {
  unreadMessages: number;
  unreadNotifications: number;
  messages: MessagePreviewItem[];
  notifications: NotificationItem[];
  soundEnabled: boolean;
  user: { name: string | null; avatar: string | null };
};

export function CabinetInboxProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [state, setState] = useState<InboxChromeState>(emptyState);
  const lastMessagesRef = useRef(0);
  const soundEnabledRef = useRef(false);
  const initializedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }

    try {
      const response = await fetch("/api/inbox/chrome", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as InboxChromeResponse;
      soundEnabledRef.current = data.soundEnabled;

      if (initializedRef.current && data.soundEnabled) {
        if (data.unreadMessages > lastMessagesRef.current) {
          playMessageNotificationSound();
        }
      } else {
        initializedRef.current = true;
      }

      lastMessagesRef.current = data.unreadMessages;

      setState({
        unreadMessages: data.unreadMessages,
        unreadNotifications: data.unreadNotifications,
        messages: data.messages.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        })),
        notifications: data.notifications.map((item) => ({
          ...item,
          readAt: item.readAt ? new Date(item.readAt) : null,
          createdAt: new Date(item.createdAt),
        })),
        soundEnabled: data.soundEnabled,
        user: data.user,
        ready: true,
      });
    } catch {
      // Ignore transient network errors.
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      setState(emptyState);
      initializedRef.current = false;
      lastMessagesRef.current = 0;
      return;
    }

    void refresh();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, INBOX_POLL_MS);

    const onRefresh = () => {
      void refresh();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    window.addEventListener(INBOX_REFRESH_EVENT, onRefresh);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(INBOX_REFRESH_EVENT, onRefresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh, session?.user?.id, status]);

  return (
    <CabinetInboxContext.Provider value={state}>{children}</CabinetInboxContext.Provider>
  );
}
