import { hasAdminPermission } from "@/lib/admin-permissions";
import { prisma } from "@/lib/prisma";

export {
  ADMIN_REVIEW_ROOT,
  adminBidReviewPath,
  adminConversationReviewPath,
  resolveAdminReviewBackHref,
} from "@/lib/admin-review-paths";

export type { AdminReviewMessage } from "@/lib/admin-review-types";

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
