"use client";

import { requestInboxRefresh } from "@/components/inbox/inbox-events";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type ConversationLiveSyncProps = {
  conversationId: string;
};

export function ConversationLiveSync({
  conversationId,
}: ConversationLiveSyncProps) {
  const router = useRouter();
  const sinceRef = useRef(new Date().toISOString());

  useEffect(() => {
    const source = new EventSource(
      `/api/conversations/${conversationId}/events?since=${encodeURIComponent(sinceRef.current)}`,
    );

    const refresh = () => {
      requestInboxRefresh();
      router.refresh();
    };

    source.addEventListener("update", () => {
      refresh();
    });

    source.addEventListener("error", () => {
      source.close();
    });

    return () => {
      source.close();
    };
  }, [conversationId, router]);

  return null;
}
