"use server";

import { auth } from "@/lib/auth";
import {
  deleteLocalAvatar,
  isManagedImageUrl,
  saveUserAvatar,
} from "@/lib/avatar-upload";
import { mapImageUploadError } from "@/lib/image-upload-errors";
import { contentPreModerationEnabled } from "@/lib/platform-config";
import type { LanguageLevel } from "@/lib/personal-data-shared";
import { prisma } from "@/lib/prisma";
import { validatePayoutDetails } from "@/lib/withdrawals-shared";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

const LEVELS = new Set<LanguageLevel>([
  "NATIVE",
  "ADVANCED",
  "INTERMEDIATE",
  "BASIC",
]);

function revalidatePersonalPaths(userId: string) {
  revalidatePath("/dashboard/personal");
  revalidatePath("/client/personal");
  revalidatePath("/profile/edit");
  revalidatePath(`/freelancers/${userId}`);
}

export async function updatePersonalData(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const firstName = (formData.get("firstName") as string | null)?.trim();
  const lastName = (formData.get("lastName") as string | null)?.trim();
  const dateOfBirthRaw = (formData.get("dateOfBirth") as string | null)?.trim();
  const country = (formData.get("country") as string | null)?.trim() || null;
  const city = (formData.get("city") as string | null)?.trim() || null;
  const wantsFreelanceProjects = formData.get("wantsFreelanceProjects") === "on";
  const wantsRemoteWork = formData.get("wantsRemoteWork") === "on";

  if (!firstName || !lastName) {
    return { error: "NAME_REQUIRED" };
  }

  let dateOfBirth: Date | null = null;
  if (dateOfBirthRaw) {
    const parsed = new Date(dateOfBirthRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "INVALID_BIRTH_DATE" };
    }
    dateOfBirth = parsed;
  }

  const languageCodes = formData.getAll("languageCodes") as string[];
  const languageLevels = formData.getAll("languageLevels") as string[];

  const languages: { language: string; level: LanguageLevel }[] = [];
  for (let i = 0; i < languageCodes.length; i += 1) {
    const language = languageCodes[i]?.trim();
    const level = languageLevels[i]?.trim() as LanguageLevel;
    if (!language) continue;
    if (!LEVELS.has(level)) {
      return { error: "LANGUAGE_LEVEL_REQUIRED" };
    }
    if (languages.some((item) => item.language === language)) {
      return { error: "DUPLICATE_LANGUAGE" };
    }
    languages.push({ language, level });
  }

  const displayName = `${firstName} ${lastName}`.trim();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        name: displayName,
        dateOfBirth,
        country,
        city,
      },
    });

    if (
      session.user.role === "FREELANCER" ||
      session.user.role === "ADMIN"
    ) {
      await tx.freelancerProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          wantsFreelanceProjects,
          wantsRemoteWork,
        },
        update: { wantsFreelanceProjects, wantsRemoteWork },
      });
    }

    await tx.userLanguage.deleteMany({ where: { userId: session.user.id } });

    if (languages.length > 0) {
      await tx.userLanguage.createMany({
        data: languages.map((item) => ({
          userId: session.user.id,
          language: item.language,
          level: item.level,
        })),
      });
    }
  });

  revalidatePersonalPaths(session.user.id);
  return { success: true };
}

export async function updateProfilePhoto(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const file = formData.get("avatar");
  const removeAvatar = formData.get("removeAvatar") === "true";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true, pendingAvatar: true },
  });

  if (!user) {
    return { error: "USER_NOT_FOUND" };
  }

  if (removeAvatar) {
    if (isManagedImageUrl(user.avatar)) {
      await deleteLocalAvatar(user.avatar);
    }
    if (isManagedImageUrl(user.pendingAvatar)) {
      await deleteLocalAvatar(user.pendingAvatar);
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null, pendingAvatar: null },
    });
    revalidatePersonalPaths(session.user.id);
    revalidatePath("/profile");
    return { success: true };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { error: "FILE_REQUIRED" };
  }

  try {
    const avatar = await saveUserAvatar(session.user.id, file);

    if (contentPreModerationEnabled) {
      if (
        user.pendingAvatar &&
        isManagedImageUrl(user.pendingAvatar) &&
        user.pendingAvatar !== avatar
      ) {
        await deleteLocalAvatar(user.pendingAvatar);
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: { pendingAvatar: avatar },
      });
    } else {
      if (isManagedImageUrl(user.avatar) && user.avatar !== avatar) {
        await deleteLocalAvatar(user.avatar);
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          avatar,
          pendingAvatar: null,
        },
      });
    }
  } catch (error) {
    return mapImageUploadError(error);
  }

  revalidatePersonalPaths(session.user.id);
  revalidatePath("/profile");
  return { success: true };
}

export async function updateContactData(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const phone = (formData.get("phone") as string | null)?.trim() || null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phone },
  });

  revalidatePersonalPaths(session.user.id);
  return { success: true };
}

export async function updatePayoutDetails(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return { error: "FREELANCERS_ONLY" };
  }

  const method = (formData.get("method") as string | null)?.trim() ?? null;
  const destinationRaw =
    (formData.get("destination") as string | null)?.trim() ?? null;
  const holderName =
    (formData.get("holderName") as string | null)?.trim() || null;

  const validated = validatePayoutDetails(method, destinationRaw);
  if ("error" in validated) return { error: validated.error };

  await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      payoutMethod: validated.method,
      payoutDestination: validated.destination,
      payoutHolderName: holderName,
    },
    update: {
      payoutMethod: validated.method,
      payoutDestination: validated.destination,
      payoutHolderName: holderName,
    },
  });

  revalidatePersonalPaths(session.user.id);
  revalidatePath("/dashboard/finances");
  return { success: true };
}
