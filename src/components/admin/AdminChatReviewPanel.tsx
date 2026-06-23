"use client";

import { AdminChatComposer } from "@/components/admin/AdminChatComposer";
import { AdminChatReviewThread } from "@/components/admin/AdminChatReviewThread";
import type { AdminReviewMessage } from "@/lib/admin-review-types";

type AdminChatReviewPanelProps = {
  mode: "conversation" | "bid";
  targetId: string;
  messages: AdminReviewMessage[];
  admin: { id: string; name: string | null; avatar?: string | null };
  participants: {
    client: { id: string; name: string | null; avatar?: string | null };
    freelancer: { id: string; name: string | null; avatar?: string | null };
  };
};

export function AdminChatReviewPanel({
  mode,
  targetId,
  messages,
  admin,
  participants,
}: AdminChatReviewPanelProps) {
  return (
    <div className="flex min-h-[min(60dvh,640px)] flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <AdminChatReviewThread
          messages={messages}
          adminId={admin.id}
          participants={participants}
        />
      </div>
      <AdminChatComposer mode={mode} targetId={targetId} />
    </div>
  );
}
