"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateUserRating } from "@/lib/rating";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createReview(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const contractId = (formData.get("contractId") as string | null)?.trim();
  const ratingRaw = (formData.get("rating") as string | null)?.trim();
  const text = (formData.get("text") as string | null)?.trim() || null;

  if (!contractId) return { error: "CONTRACT_NOT_FOUND" };

  const rating = Number(ratingRaw);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "RATING_RANGE" };
  }

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      project: { select: { status: true, slug: true } },
    },
  });

  if (!contract) return { error: "CONTRACT_NOT_FOUND" };

  if (contract.project.status !== "CLOSED" || contract.status !== "RELEASED") {
    return { error: "REVIEW_AFTER_COMPLETION_ONLY" };
  }

  const isClient = contract.clientId === session.user.id;
  const isFreelancer = contract.freelancerId === session.user.id;

  if (!isClient && !isFreelancer && session.user.role !== "ADMIN") {
    return { error: "ACCESS_DENIED" };
  }

  const toUserId = isClient ? contract.freelancerId : contract.clientId;

  const existing = await prisma.review.findUnique({
    where: {
      contractId_fromUserId: {
        contractId,
        fromUserId: session.user.id,
      },
    },
  });

  if (existing) return { error: "REVIEW_ALREADY_SUBMITTED" };

  await prisma.review.create({
    data: {
      contractId,
      fromUserId: session.user.id,
      toUserId,
      rating,
      text,
    },
  });

  await recalculateUserRating(toUserId);

  revalidatePath(`/projects/${contract.project.slug}`);
  revalidatePath(`/freelancers/${contract.freelancerId}`);
  if (toUserId !== contract.freelancerId) {
    revalidatePath(`/freelancers/${toUserId}`);
  }
  revalidatePath("/profile");
  revalidatePath("/profile/reviews");
  revalidatePath("/dashboard/reviews");
  revalidatePath("/client/reviews");

  return { success: true };
}
