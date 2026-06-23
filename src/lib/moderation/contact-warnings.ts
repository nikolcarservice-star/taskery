import { prisma } from "@/lib/prisma";
import { truncateBlockedSnippet } from "@/lib/moderation/message-guard";

export async function createConversationContactWarning({
  conversationId,
  violationUserId,
  blockedContent,
}: {
  conversationId: string;
  violationUserId: string;
  blockedContent: string;
}) {
  await prisma.message.create({
    data: {
      conversationId,
      kind: "EXTERNAL_CONTACT_WARNING",
      content: "",
      violationUserId,
      blockedSnippet: truncateBlockedSnippet(blockedContent),
    },
  });
}

export async function createBidContactWarning({
  bidId,
  violationUserId,
  blockedContent,
}: {
  bidId: string;
  violationUserId: string;
  blockedContent: string;
}) {
  await prisma.bidMessage.create({
    data: {
      bidId,
      kind: "EXTERNAL_CONTACT_WARNING",
      content: "",
      violationUserId,
      blockedSnippet: truncateBlockedSnippet(blockedContent),
    },
  });
}
