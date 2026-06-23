"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { error?: string; success?: boolean };

export async function sendMessage(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const conversationId = (formData.get("conversationId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!conversationId || !content) {
    return { error: "MESSAGE_REQUIRED" };
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      project: { select: { slug: true, title: true } },
    },
  });

  if (!conversation) return { error: "CONVERSATION_NOT_FOUND" };

  const isParticipant =
    conversation.clientId === session.user.id ||
    conversation.freelancerId === session.user.id ||
    session.user.role === "ADMIN";

  if (!isParticipant) return { error: "ACCESS_DENIED" };

  await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      updatedAt: new Date(),
      hiddenByClientAt: null,
      hiddenByFreelancerAt: null,
    },
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath(`/projects/${conversation.project.slug}`);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/client", "layout");

  return { success: true };
}

export async function hideConversations(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const conversationIds = formData
    .getAll("conversationIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (conversationIds.length === 0) {
    return { error: "SELECT_CONVERSATIONS" };
  }

  const conversations = await prisma.conversation.findMany({
    where: { id: { in: conversationIds } },
  });

  if (conversations.length === 0) {
    return { error: "CONVERSATIONS_NOT_FOUND" };
  }

  const now = new Date();

  for (const conversation of conversations) {
    const isClient = conversation.clientId === session.user.id;
    const isFreelancer = conversation.freelancerId === session.user.id;

    if (!isClient && !isFreelancer) {
      return { error: "ACCESS_DENIED" };
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
