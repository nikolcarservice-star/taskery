"use server";

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
    return { error: "Только для фрилансеров" };
  }

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: { select: { id: true } },
      user: { select: { bio: true, name: true } },
    },
  });

  if (!profile) {
    return { error: "Сначала заполните профиль фрилансера" };
  }

  if (profile.verificationStatus === "PENDING") {
    return { error: "Заявка уже на рассмотрении" };
  }

  if (profile.verificationStatus === "APPROVED") {
    return { error: "Профиль уже верифицирован" };
  }

  if (!profile.title?.trim()) {
    return { error: "Укажите специализацию в профиле" };
  }

  if (!profile.user.bio?.trim() || profile.user.bio.trim().length < 20) {
    return { error: "Заполните описание профиля (минимум 20 символов)" };
  }

  if (profile.skills.length === 0) {
    return { error: "Добавьте хотя бы один навык" };
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
