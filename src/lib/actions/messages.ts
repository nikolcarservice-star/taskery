"use server";

import { createUserNotification } from "@/lib/create-user-notification";
import { maybeSendMessageNotificationEmail } from "@/lib/message-email-notify";
import { auth } from "@/lib/auth";
import { actionError } from "@/lib/action-errors";
import { createConversationContactWarning } from "@/lib/moderation/contact-warnings";
import {
  detectExternalContactAttempt,
  detectOffPlatformContacts,
  shouldGuardProjectMessages,
} from "@/lib/moderation/message-guard";
import { prisma } from "@/lib/prisma";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { revalidateInboxPaths } from "@/lib/revalidate-inbox";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { error?: string; success?: boolean };

export async function sendMessage(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const conversationId = (formData.get("conversationId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!conversationId || !content) {
    return actionError("MESSAGE_REQUIRED");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      project: {
        select: {
          slug: true,
          title: true,
          contract: { select: { status: true } },
        },
      },
    },
  });

  if (!conversation) return actionError("CONVERSATION_NOT_FOUND");

  const isParticipant =
    conversation.clientId === session.user.id ||
    conversation.freelancerId === session.user.id ||
    session.user.role === "ADMIN";

  if (!isParticipant) return actionError("ACCESS_DENIED");

  const guardMessages = shouldGuardProjectMessages(
    conversation.project.contract?.status,
  );

  if (session.user.role !== "ADMIN") {
    const violation = guardMessages
      ? detectExternalContactAttempt(content)
      : detectOffPlatformContacts(content);

    if (violation.blocked) {
      await createConversationContactWarning({
        conversationId,
        violationUserId: session.user.id,
        blockedContent: content,
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      revalidatePath("/messages");
      revalidatePath(`/messages/${conversationId}`);
      revalidatePath(`/projects/${conversation.project.slug}`);
      revalidatePath("/admin");

      return actionError("MESSAGE_EXTERNAL_CONTACT_BLOCKED");
    }
  }

  const recipientId =
    conversation.clientId === session.user.id
      ? conversation.freelancerId
      : conversation.clientId;

  await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
    },
  });

  const senderName =
    session.user.name ??
    (session.user.role === "ADMIN" ? "Администратор" : "Участник");

  const preview =
    content.length > 120 ? `${content.slice(0, 117)}…` : content;
  const messageLink = `/messages/${conversationId}`;

  await createUserNotification({
    userId: recipientId,
    type: "NEW_MESSAGE",
    title: "Новое сообщение",
    body: `${senderName} · ${conversation.project.title}`,
    link: messageLink,
    metadata: {
      conversationId,
      preview,
    },
  });

  void maybeSendMessageNotificationEmail({
    recipientId,
    kind: "conversation",
    senderName,
    projectTitle: conversation.project.title,
    preview: content,
    link: messageLink,
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      updatedAt: new Date(),
      hiddenByClientAt: null,
      hiddenByFreelancerAt: null,
    },
  });

  revalidatePath(`/projects/${conversation.project.slug}`);
  revalidateInboxPaths();

  return { success: true };
}

export async function hideConversations(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const conversationIds = formData
    .getAll("conversationIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (conversationIds.length === 0) {
    return actionError("SELECT_CONVERSATIONS");
  }

  const conversations = await prisma.conversation.findMany({
    where: { id: { in: conversationIds } },
  });

  if (conversations.length === 0) {
    return actionError("CONVERSATIONS_NOT_FOUND");
  }

  const now = new Date();

  for (const conversation of conversations) {
    const isClient = conversation.clientId === session.user.id;
    const isFreelancer = conversation.freelancerId === session.user.id;

    if (!isClient && !isFreelancer) {
      return actionError("ACCESS_DENIED");
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: isClient
        ? { hiddenByClientAt: now }
        : { hiddenByFreelancerAt: now },
    });
  }

  revalidatePath("/messages");

  for (const conversation of conversations) {
    revalidatePath(`/messages/${conversation.id}`);
  }

  const rawRedirect = (formData.get("redirectTo") as string | null)?.trim();
  if (rawRedirect) {
    redirect(safeRedirectPath(rawRedirect, "/messages"));
  }

  return { success: true };
}
