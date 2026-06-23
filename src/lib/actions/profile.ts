"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { grantPortfolioBoostIfEligible } from "@/lib/taskboost-promotion";
import { sanitizeOptionalHttpUrl } from "@/lib/safe-url";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const name = (formData.get("name") as string | null)?.trim() || null;
  const bio = (formData.get("bio") as string | null)?.trim() || null;
  const avatarRaw = (formData.get("avatar") as string | null)?.trim() || null;
  const avatar = sanitizeOptionalHttpUrl(avatarRaw);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio, avatar },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard/portfolio");
  revalidatePath(`/freelancers/${session.user.id}`);

  return { success: true };
}

export async function updateFreelancerProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return { error: "FREELANCERS_ONLY" };
  }

  const title = (formData.get("title") as string | null)?.trim() || null;
  const hourlyRateRaw = (formData.get("hourlyRate") as string | null)?.trim();
  const skillIds = formData.getAll("skillIds") as string[];

  let hourlyRate: number | null = null;
  if (hourlyRateRaw) {
    const parsed = Number(hourlyRateRaw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: "INVALID_RATE" };
    }
    hourlyRate = parsed;
  }

  const profile = await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, title, hourlyRate },
    update: { title, hourlyRate },
  });

  await prisma.freelancerProfile.update({
    where: { id: profile.id },
    data: {
      skills: { set: skillIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/profile/edit");
  revalidatePath("/dashboard/profile");
  revalidatePath("/freelancers");
  revalidatePath(`/freelancers/${session.user.id}`);

  return { success: true };
}

export async function addPortfolioItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  const imageUrl = sanitizeOptionalHttpUrl(
    (formData.get("imageUrl") as string | null)?.trim(),
  );
  const projectUrl = sanitizeOptionalHttpUrl(
    (formData.get("projectUrl") as string | null)?.trim(),
  );

  if (!title) return { error: "PORTFOLIO_TITLE_REQUIRED" };

  const profile = await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  await prisma.portfolioItem.create({
    data: {
      freelancerProfileId: profile.id,
      title,
      description,
      imageUrl,
      projectUrl,
    },
  });

  await grantPortfolioBoostIfEligible(session.user.id, profile.id);

  revalidatePath("/profile/edit");
  revalidatePath("/dashboard/portfolio");
  revalidatePath(`/freelancers/${session.user.id}`);

  return { success: true };
}

export async function deletePortfolioItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const itemId = (formData.get("itemId") as string | null)?.trim();
  if (!itemId) return { error: "ITEM_NOT_FOUND" };

  const item = await prisma.portfolioItem.findUnique({
    where: { id: itemId },
    include: { freelancerProfile: true },
  });

  if (!item || item.freelancerProfile.userId !== session.user.id) {
    return { error: "ACCESS_DENIED" };
  }

  await prisma.portfolioItem.delete({ where: { id: itemId } });

  revalidatePath("/profile/edit");
  revalidatePath("/dashboard/portfolio");
  revalidatePath(`/freelancers/${session.user.id}`);

  return { success: true };
}
