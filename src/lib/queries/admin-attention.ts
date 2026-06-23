import { prisma } from "@/lib/prisma";

export type ModerationAttentionItem = {
  id: string;
  source: "conversation" | "bid";
  createdAt: string;
  blockedSnippet: string | null;
  violationUser: { id: string; name: string | null; email: string };
  project: { id: string; slug: string; title: string };
  conversationId: string | null;
  bidId: string | null;
};

const ATTENTION_WINDOW_DAYS = 30;

export async function getModerationAttentionItems(): Promise<ModerationAttentionItem[]> {
  const since = new Date();
  since.setDate(since.getDate() - ATTENTION_WINDOW_DAYS);

  const [conversationWarnings, bidWarnings] = await Promise.all([
    prisma.message.findMany({
      where: {
        kind: "EXTERNAL_CONTACT_WARNING",
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        violationUser: { select: { id: true, name: true, email: true } },
        conversation: {
          include: {
            project: { select: { id: true, slug: true, title: true } },
          },
        },
      },
    }),
    prisma.bidMessage.findMany({
      where: {
        kind: "EXTERNAL_CONTACT_WARNING",
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        violationUser: { select: { id: true, name: true, email: true } },
        bid: {
          include: {
            project: { select: { id: true, slug: true, title: true } },
          },
        },
      },
    }),
  ]);

  const items: ModerationAttentionItem[] = [];

  for (const warning of conversationWarnings) {
    if (!warning.violationUser || !warning.conversation?.project) continue;
    items.push({
      id: warning.id,
      source: "conversation",
      createdAt: warning.createdAt.toISOString(),
      blockedSnippet: warning.blockedSnippet,
      violationUser: warning.violationUser,
      project: warning.conversation.project,
      conversationId: warning.conversationId,
      bidId: null,
    });
  }

  for (const warning of bidWarnings) {
    if (!warning.violationUser || !warning.bid?.project) continue;
    items.push({
      id: `bid-${warning.id}`,
      source: "bid",
      createdAt: warning.createdAt.toISOString(),
      blockedSnippet: warning.blockedSnippet,
      violationUser: warning.violationUser,
      project: warning.bid.project,
      conversationId: null,
      bidId: warning.bidId,
    });
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
