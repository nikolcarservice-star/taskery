"use client";

import { CabinetInboxProvider } from "@/components/inbox/CabinetInboxProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CabinetInboxProvider>{children}</CabinetInboxProvider>
    </SessionProvider>
  );
}
