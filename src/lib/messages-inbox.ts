import type { MessagePreviewItem } from "@/lib/messages-shared";
import { prisma } from "@/lib/prisma";

const MESSAGE_NOTIFICATION_TYPES = ["NEW_MESSAGE", "BID_MESSAGE"] as const;

function visibleConversationWhere(userId: string) {
  return {
    OR: [
      { clientId: userId, hiddenByClientAt: null },
      { freelancerId: userId, hiddenByFreelancerAt: null },
    ],
  };
}

export async function getUnreadConversationMessageCount(
  userId: string,
): Promise<number> {
  return prisma.message.count({
    where: {
      readAt: null,
      kind: "USER",
      senderId: { not: userId },
      conversation: visibleConversationWhere(userId),
    },
  });
}

export async function getUnreadBidMessageNotificationCount(
  userId: string,
): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      type: "BID_MESSAGE",
      readAt: null,
    },
  });
}

export async function getUnreadInboxMessageCount(userId: string): Promise<number> {
  const [conversations, bidMessages] = await Promise.all([
    getUnreadConversationMessageCount(userId),
    getUnreadBidMessageNotificationCount(userId),
  ]);

  return conversations + bidMessages;
}

type BidMessageNotificationMetadata = {
  preview?: string;
};

export async function getRecentBidMessagePreviews(
  userId: string,
  limit = 8,
): Promise<MessagePreviewItem[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId, type: "BID_MESSAGE" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      body: true,
      link: true,
      readAt: true,
      createdAt: true,
      metadata: true,
    },
  });

  return notifications.map((notification) => {
    const metadata = notification.metadata as BidMessageNotificationMetadata | null;
    const [partnerName, projectTitle] = (notification.body ?? " · ").split(" · ");

    return {
      id: notification.id,
      partnerName: partnerName || null,
      projectTitle: projectTitle || "Проект",
      preview: metadata?.preview ?? null,
      link: notification.link ?? "/messages",
      unreadCount: notification.readAt ? 0 : 1,
      createdAt: notification.createdAt,
    };
  });
}

export async function getRecentInboxMessagePreviews(
  userId: string,
  limit = 8,
): Promise<MessagePreviewItem[]> {
  const [conversations, bidMessages] = await Promise.all([
    getRecentMessagePreviews(userId, limit),
    getRecentBidMessagePreviews(userId, limit),
  ]);

  return [...conversations, ...bidMessages]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export async function getRecentMessagePreviews(
  userId: string,
  limit = 8,
): Promise<MessagePreviewItem[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      ...visibleConversationWhere(userId),
      messages: { some: {} },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      project: { select: { title: true } },
      client: { select: { id: true, name: true } },
      freelancer: { select: { id: true, name: true } },
      messages: {
        where: { kind: "USER" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
    },
  });

  if (conversations.length === 0) {
    return [];
  }

  const unreadByConversation = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: { in: conversations.map((conv) => conv.id) },
      readAt: null,
      kind: "USER",
      senderId: { not: userId },
    },
    _count: { id: true },
  });

  const unreadMap = new Map(
    unreadByConversation.map((row) => [row.conversationId, row._count.id]),
  );

  return conversations.map((conv) => {
    const isClient = conv.clientId === userId;
    const partner = isClient ? conv.freelancer : conv.client;
    const lastMessage = conv.messages[0];

    return {
      id: conv.id,
      partnerName: partner.name,
      projectTitle: conv.project.title,
      preview: lastMessage?.content ?? null,
      link: `/messages/${conv.id}`,
      unreadCount: unreadMap.get(conv.id) ?? 0,
      createdAt: lastMessage?.createdAt ?? conv.updatedAt,
    };
  });
}

export async function markConversationMessagesRead(
  userId: string,
  conversationId: string,
): Promise<number> {
  const result = await prisma.message.updateMany({
    where: {
      conversationId,
      kind: "USER",
      senderId: { not: userId },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return result.count;
}

export { MESSAGE_NOTIFICATION_TYPES };
