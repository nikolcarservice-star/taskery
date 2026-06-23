"use server";

import { auth } from "@/lib/auth";
import { sendBidNotificationEmail } from "@/lib/email";
import { notifyClientNewBid } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";
import { revalidatePath } from "next/cache";

export type CreateBidState = {
  error?: string;
  success?: boolean;
};

export async function createBid(
  _prevState: CreateBidState,
  formData: FormData,
): Promise<CreateBidState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return { error: "FREELANCERS_ONLY" };
  }

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const costRaw = (formData.get("cost") as string | null)?.trim();
  const timeframeRaw = (formData.get("timeframe") as string | null)?.trim();
  const coverLetter = (formData.get("coverLetter") as string | null)?.trim();

  if (!projectId) {
    return { error: "PROJECT_NOT_FOUND" };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      clientId: true,
      client: { select: { email: true } },
    },
  });

  if (!project) {
    return { error: "PROJECT_NOT_FOUND" };
  }

  if (project.status !== "OPEN") {
    return { error: "CANNOT_BID_CLOSED_PROJECT" };
  }

  if (project.clientId === session.user.id) {
    return { error: "CANNOT_BID_OWN_PROJECT" };
  }

  const cost = Number(costRaw);
  if (!Number.isFinite(cost) || cost <= 0) {
    return { error: "INVALID_BID_AMOUNT" };
  }

  const timeframe = Number(timeframeRaw);
  if (!Number.isInteger(timeframe) || timeframe <= 0) {
    return { error: "INVALID_BID_DAYS" };
  }

  if (!coverLetter || coverLetter.length < 20) {
    return { error: "COVER_LETTER_TOO_SHORT" };
  }

  const existing = await prisma.bid.findUnique({
    where: {
      projectId_freelancerId: {
        projectId,
        freelancerId: session.user.id,
      },
    },
  });

  if (existing) {
    return { error: "ALREADY_BID" };
  }

  const bid = await prisma.bid.create({
    data: {
      projectId,
      freelancerId: session.user.id,
      cost,
      timeframe,
      coverLetter,
    },
  });

  await sendBidNotificationEmail(
    project.client.email,
    project.title,
    absoluteUrl(`/projects/${project.slug}`),
  );

  await notifyClientNewBid({
    clientId: project.clientId,
    freelancerId: session.user.id,
    projectId: project.id,
    projectSlug: project.slug,
    projectTitle: project.title,
    bidId: bid.id,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/client/projects");
  revalidatePath("/client");
  revalidatePath("/notifications");
  revalidatePath("/dashboard/bids");

  return { success: true };
}
