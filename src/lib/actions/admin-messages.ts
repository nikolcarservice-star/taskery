"use server";

import { actionError } from "@/lib/action-errors";
import { requireModerationAdmin } from "@/lib/actions/admin-moderation";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AdminMessageActionState = { error?: string; success?: boolean };

async function notifyAdminConversationMessage({
  recipientId,
  adminId,
  adminName,
  conversationId,
  projectTitle,
  content,
}: {
  recipientId: string;
  adminId: string;
  adminName: string;
  conversationId: string;
  projectTitle: string;
  content: string;
}) {
  if (recipientId === adminId) return;

  const preview =
    content.length > 120 ? `${content.slice(0, 117)}…` : content;

  await createLocalizedUserNotification({
    userId: recipientId,
    type: "NEW_MESSAGE",
    template: "ADMIN_MESSAGE",
    variables: {
      senderName: adminName,
      projectTitle,
    },
    variableFallbacks: { senderName: "admin" },
    link: `/messages/${conversationId}`,
    metadata: {
      conversationId,
      senderId: adminId,
      preview,
      fromAdmin: true,
    },
  });
}

async function notifyAdminBidMessage({
  recipientId,
  adminId,
  adminName,
  projectId,
  projectSlug,
  projectTitle,
  bidId,
  content,
}: {
  recipientId: string;
  adminId: string;
  adminName: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  bidId: string;
  content: string;
}) {
  if (recipientId === adminId) return;

  const preview =
    content.length > 120 ? `${content.slice(0, 117)}…` : content;

  await createLocalizedUserNotification({
    userId: recipientId,
    type: "BID_MESSAGE",
    template: "ADMIN_BID_MESSAGE",
    variables: {
      senderName: adminName,
      projectTitle,
    },
    variableFallbacks: { senderName: "admin" },
    link: `/projects/${projectSlug}`,
    metadata: {
      projectId,
      bidId,
      senderId: adminId,
      preview,
      fromAdmin: true,
    },
  });
}

export async function sendAdminConversationMessage(
  _prevState: AdminMessageActionState,
  formData: FormData,
): Promise<AdminMessageActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const conversationId = (formData.get("conversationId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!conversationId || !content) {
    return actionError("MESSAGE_REQUIRED");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      project: { select: { slug: true, title: true } },
    },
  });

  if (!conversation) return actionError("CONVERSATION_NOT_FOUND");

  const adminProfile = await prisma.user.findUnique({
    where: { id: authResult.admin.id },
    select: { name: true, email: true },
  });

  const adminName = adminProfile?.name ?? adminProfile?.email ?? "";

  await prisma.message.create({
    data: {
      conversationId,
      senderId: authResult.admin.id,
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

  await Promise.all([
    notifyAdminConversationMessage({
      recipientId: conversation.clientId,
      adminId: authResult.admin.id,
      adminName,
      conversationId,
      projectTitle: conversation.project.title,
      content,
    }),
    notifyAdminConversationMessage({
      recipientId: conversation.freelancerId,
      adminId: authResult.admin.id,
      adminName,
      conversationId,
      projectTitle: conversation.project.title,
      content,
    }),
  ]);

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath(`/projects/${conversation.project.slug}`);
  revalidatePath(`/admin/review/conversation/${conversationId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/mobile/moderation");

  return { success: true };
}

export async function sendAdminBidMessage(
  _prevState: AdminMessageActionState,
  formData: FormData,
): Promise<AdminMessageActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const bidId = (formData.get("bidId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!bidId || !content) {
    return actionError("MESSAGE_REQUIRED");
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: {
        select: {
          id: true,
          slug: true,
          title: true,
          clientId: true,
        },
      },
    },
  });

  if (!bid) return actionError("BID_NOT_FOUND");

  const adminProfile = await prisma.user.findUnique({
    where: { id: authResult.admin.id },
    select: { name: true, email: true },
  });

  const adminName = adminProfile?.name ?? adminProfile?.email ?? "";

  await prisma.bidMessage.create({
    data: {
      bidId,
      senderId: authResult.admin.id,
      content,
    },
  });

  await Promise.all([
    notifyAdminBidMessage({
      recipientId: bid.project.clientId,
      adminId: authResult.admin.id,
      adminName,
      projectId: bid.project.id,
      projectSlug: bid.project.slug,
      projectTitle: bid.project.title,
      bidId,
      content,
    }),
    notifyAdminBidMessage({
      recipientId: bid.freelancerId,
      adminId: authResult.admin.id,
      adminName,
      projectId: bid.project.id,
      projectSlug: bid.project.slug,
      projectTitle: bid.project.title,
      bidId,
      content,
    }),
  ]);

  revalidatePath(`/projects/${bid.project.slug}`);
  revalidatePath(`/admin/review/bid/${bidId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/mobile/moderation");

  return { success: true };
}
