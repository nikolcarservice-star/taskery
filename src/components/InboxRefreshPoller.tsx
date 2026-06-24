"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const POLL_MS = 20_000;

export function InboxRefreshPoller() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    const timer = window.setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  return null;
}
