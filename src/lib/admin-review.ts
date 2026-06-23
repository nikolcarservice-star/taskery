import { hasAdminPermission } from "@/lib/admin-permissions";
import type { MessageKind } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const ADMIN_REVIEW_ROOT = "/admin/review";

export function adminConversationReviewPath(
  conversationId: string,
  backHref?: string,
): string {
  const path = `${ADMIN_REVIEW_ROOT}/conversation/${conversationId}`;
  if (!backHref) return path;
  return `${path}?back=${encodeURIComponent(backHref)}`;
}

export function adminBidReviewPath(bidId: string, backHref?: string): string {
  const path = `${ADMIN_REVIEW_ROOT}/bid/${bidId}`;
  if (!backHref) return path;
  return `${path}?back=${encodeURIComponent(backHref)}`;
}

export function resolveAdminReviewBackHref(back?: string): string {
  if (back && back.startsWith("/admin")) {
    return back;
  }
  return "/admin";
}

export type AdminReviewMessage = {
  id: string;
  kind: MessageKind;
  content: string;
  createdAt: Date;
  blockedSnippet?: string | null;
  sender: { id: string; name: string | null; avatar?: string | null } | null;
  violationUser: { id: string; name: string | null } | null;
};

export function canAccessAdminReview(
  permissions: Parameters<typeof hasAdminPermission>[0],
): boolean {
  return hasAdminPermission(permissions, "MODERATION");
}

const messageInclude = {
  sender: { select: { id: true, name: true, avatar: true } },
  violationUser: { select: { id: true, name: true } },
} as const;

export async function loadAdminConversationReview(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      project: { select: { id: true, title: true, slug: true } },
      client: { select: { id: true, name: true, avatar: true } },
      freelancer: { select: { id: true, name: true, avatar: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: messageInclude,
      },
    },
  });
}

export async function loadAdminBidReview(bidId: string) {
  return prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
          client: { select: { id: true, name: true, avatar: true } },
        },
      },
      freelancer: { select: { id: true, name: true, avatar: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: messageInclude,
      },
    },
  });
}
