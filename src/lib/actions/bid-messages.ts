"use server";

import { auth } from "@/lib/auth";
import { notifyBidMessage } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

export async function sendBidMessage(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const bidId = (formData.get("bidId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!bidId || !content) {
    return { error: "MESSAGE_REQUIRED" };
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: {
        select: { id: true, slug: true, title: true, clientId: true, status: true },
      },
    },
  });

  if (!bid) return { error: "BID_NOT_FOUND" };

  if (bid.status !== "PENDING") {
    return { error: "BID_CHAT_BEFORE_SELECTION" };
  }

  if (bid.project.status !== "OPEN") {
    return { error: "PROJECT_NOT_ACCEPTING_BIDS" };
  }

  const isClient =
    bid.project.clientId === session.user.id || session.user.role === "ADMIN";
  const isFreelancer = bid.freelancerId === session.user.id;

  if (!isClient && !isFreelancer) {
    return { error: "ACCESS_DENIED" };
  }

  if (isFreelancer) {
    const clientHasWritten = await prisma.bidMessage.count({
      where: {
        bidId,
        senderId: bid.project.clientId,
      },
    });

    if (clientHasWritten === 0) {
      return { error: "CLIENT_HAS_NOT_STARTED_CHAT" };
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
