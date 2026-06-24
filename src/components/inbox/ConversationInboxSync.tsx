"use client";

import { requestInboxRefresh } from "@/components/inbox/inbox-events";
import { INBOX_POLL_MS } from "@/lib/inbox-poll";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ConversationInboxSync() {
  const router = useRouter();

  useEffect(() => {
    const sync = () => {
      requestInboxRefresh();
      router.refresh();
    };

    sync();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sync();
      }
    }, INBOX_POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        sync();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);

  return null;
}
