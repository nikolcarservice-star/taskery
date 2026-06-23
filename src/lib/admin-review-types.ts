import type { MessageKind } from "@/generated/prisma/client";

export type AdminReviewMessage = {
  id: string;
  kind: MessageKind;
  content: string;
  createdAt: Date;
  blockedSnippet?: string | null;
  sender: { id: string; name: string | null; avatar?: string | null } | null;
  violationUser: { id: string; name: string | null } | null;
};
