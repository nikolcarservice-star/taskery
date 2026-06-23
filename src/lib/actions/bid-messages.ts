"use server";

import { auth } from "@/lib/auth";
import { actionError } from "@/lib/action-errors";
import { createBidContactWarning } from "@/lib/moderation/contact-warnings";
import { detectExternalContactAttempt } from "@/lib/moderation/message-guard";
import { notifyBidMessage } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

export async function sendBidMessage(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const bidId = (formData.get("bidId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!bidId || !content) {
    return actionError("MESSAGE_REQUIRED");
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: {
        select: { id: true, slug: true, title: true, clientId: true, status: true },
      },
    },
  });

  if (!bid) return actionError("BID_NOT_FOUND");

  if (bid.status !== "PENDING") {
    return actionError("BID_CHAT_BEFORE_SELECTION");
  }

  if (bid.project.status !== "OPEN") {
    return actionError("PROJECT_NOT_ACCEPTING_BIDS");
  }

  const isClient =
    bid.project.clientId === session.user.id || session.user.role === "ADMIN";
  const isFreelancer = bid.freelancerId === session.user.id;

  if (!isClient && !isFreelancer) {
    return actionError("ACCESS_DENIED");
  }

  if (isFreelancer) {
    const clientHasWritten = await prisma.bidMessage.count({
      where: {
        bidId,
        senderId: bid.project.clientId,
        kind: "USER",
      },
    });

    if (clientHasWritten === 0) {
      return actionError("CLIENT_HAS_NOT_STARTED_CHAT");
    }
  }

  if (session.user.role !== "ADMIN") {
    const violation = detectExternalContactAttempt(content);
    if (violation.blocked) {
      await createBidContactWarning({
        bidId,
        violationUserId: session.user.id,
        blockedContent: content,
      });

      revalidatePath(`/projects/${bid.project.slug}`);
      revalidatePath("/admin");

      return actionError("MESSAGE_EXTERNAL_CONTACT_BLOCKED");
    }
  }

  await prisma.bidMessage.create({
    data: {
      bidId,
      senderId: session.user.id,
      content,
    },
  });

  const recipientId = isClient ? bid.freelancerId : bid.project.clientId;

  await notifyBidMessage({
    recipientId,
    senderId: session.user.id,
    projectId: bid.project.id,
    projectSlug: bid.project.slug,
    projectTitle: bid.project.title,
    bidId,
    content,
  });

  revalidatePath(`/projects/${bid.project.slug}`);
  revalidatePath("/dashboard/bids");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/client", "layout");

  return { success: true };
}
