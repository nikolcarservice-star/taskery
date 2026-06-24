"use client";

import { requestInboxRefresh } from "@/components/inbox/inbox-events";
import { useEffect } from "react";

export function ConversationInboxSync() {
  useEffect(() => {
    requestInboxRefresh();
  }, []);

  return null;
}
