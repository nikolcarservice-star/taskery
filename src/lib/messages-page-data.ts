import { prisma } from "@/lib/prisma";
import type { ConversationRow } from "@/components/MessagesInbox";

export async function loadMessagesPageData(
  userId: string,
): Promise<ConversationRow[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          clientId: userId,
          hiddenByClientAt: null,
        },
        {
          freelancerId: userId,
          hiddenByFreelancerAt: null,
        },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      project: {
        select: { title: true, slug: true, status: true },
      },
      client: { select: { id: true, name: true, avatar: true } },
      freelancer: { select: { id: true, name: true, avatar: true } },
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
    },
  });

  const unreadByConversation =
    conversations.length > 0
      ? await prisma.message.groupBy({
          by: ["conversationId"],
          where: {
            conversationId: { in: conversations.map((conv) => conv.id) },
            readAt: null,
            senderId: { not: userId },
          },
          _count: { id: true },
        })
      : [];

  const unreadMap = new Map(
    unreadByConversation.map((row) => [row.conversationId, row._count.id]),
  );

  return conversations.map((conv) => {
    const isClient = conv.clientId === userId;
    const partner = isClient ? conv.freelancer : conv.client;
    const lastMsg = conv.messages[0];

    return {
      id: conv.id,
      partner: {
        id: partner.id,
        name: partner.name,
        avatar: partner.avatar,
      },
      project: {
        title: conv.project.title,
        slug: conv.project.slug,
        status: conv.project.status,
      },
      messageCount: conv._count.messages,
      unreadCount: unreadMap.get(conv.id) ?? 0,
      lastMessageAt: lastMsg?.createdAt.toISOString() ?? null,
      lastMessagePreview: lastMsg?.content ?? null,
    };
  });
}
