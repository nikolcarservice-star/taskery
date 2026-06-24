"use server";

import { actionError } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type VerificationRequestState = {
  error?: string;
  success?: boolean;
};

export async function requestProfileVerification(
  _prevState: VerificationRequestState,
  _formData: FormData,
): Promise<VerificationRequestState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return actionError("FREELANCERS_ONLY");
  }

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: { select: { id: true } },
      user: { select: { bio: true, name: true } },
    },
  });

  if (!profile) {
    return actionError("FREELANCER_PROFILE_REQUIRED");
  }

  if (profile.verificationStatus === "PENDING") {
    return actionError("VERIFICATION_ALREADY_PENDING");
  }

  if (profile.verificationStatus === "APPROVED") {
    return actionError("VERIFICATION_ALREADY_APPROVED");
  }

  if (!profile.title?.trim()) {
    return actionError("SPECIALIZATION_REQUIRED");
  }

  if (!profile.user.bio?.trim() || profile.user.bio.trim().length < 20) {
    return actionError("PROFILE_BIO_TOO_SHORT");
  }

  if (profile.skills.length === 0) {
    return actionError("SKILL_REQUIRED");
  }

  await prisma.freelancerProfile.update({
    where: { userId: session.user.id },
    data: {
      verificationStatus: "PENDING",
      verificationRequestedAt: new Date(),
      verificationReviewedAt: null,
      verificationNote: null,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath(`/freelancers/${session.user.id}`);
  return { success: true };
}
