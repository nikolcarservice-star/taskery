"use server";

import { auth } from "@/lib/auth";
import type {
  LegalStatus,
  WorkAvailability,
} from "@/lib/freelancer-profile-shared";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

const AVAILABILITY = new Set<WorkAvailability>([
  "AVAILABLE",
  "SLIGHTLY_BUSY",
  "VERY_BUSY",
  "NOT_WORKING",
  "ON_VACATION",
]);

const LEGAL = new Set<LegalStatus>(["INDIVIDUAL", "SELF_EMPLOYED", "COMPANY"]);

function revalidateProfilePaths(userId: string) {
  revalidatePath("/dashboard/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/freelancers");
  revalidatePath(`/freelancers/${userId}`);
}

async function requireFreelancerUser() {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" } as const;
  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return { error: "FREELANCERS_ONLY" } as const;
  }
  return { session } as const;
}

export async function updateFreelancerAbout(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireFreelancerUser();
  if ("error" in authResult) return { error: authResult.error };

  const bio = (formData.get("bio") as string | null)?.trim() || null;
  const workAvailability = formData.get("workAvailability") as WorkAvailability;

  if (!AVAILABILITY.has(workAvailability)) {
    return { error: "SELECT_STATUS" };
  }

  const { session } = authResult;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { bio },
    }),
    prisma.freelancerProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, workAvailability },
      update: { workAvailability },
    }),
  ]);

  revalidateProfilePaths(session.user.id);
  return { success: true };
}

export async function updateFreelancerSpecialization(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireFreelancerUser();
  if ("error" in authResult) return { error: authResult.error };

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

  const { session } = authResult;

  const profile = await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, title, hourlyRate },
    update: { title, hourlyRate },
  });

  await prisma.freelancerProfile.update({
    where: { id: profile.id },
    data: { skills: { set: skillIds.map((id) => ({ id })) } },
  });

  revalidateProfilePaths(session.user.id);
  return { success: true };
}

export async function updateFreelancerLegal(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireFreelancerUser();
  if ("error" in authResult) return { error: authResult.error };

  const legalStatusRaw = (formData.get("legalStatus") as string | null)?.trim();
  const taxId = (formData.get("taxId") as string | null)?.trim() || null;

  let legalStatus: LegalStatus | null = null;
  if (legalStatusRaw) {
    if (!LEGAL.has(legalStatusRaw as LegalStatus)) {
      return { error: "LEGAL_STATUS_REQUIRED" };
    }
    legalStatus = legalStatusRaw as LegalStatus;
  }

  const { session } = authResult;

  await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, legalStatus, taxId },
    update: { legalStatus, taxId },
  });

  revalidateProfilePaths(session.user.id);
  return { success: true };
}

export async function updateFreelancerExtra(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authResult = await requireFreelancerUser();
  if ("error" in authResult) return { error: authResult.error };

  const website = (formData.get("website") as string | null)?.trim() || null;
  const experienceRaw = (formData.get("experienceYears") as string | null)?.trim();

  let experienceYears: number | null = null;
  if (experienceRaw) {
    const parsed = Number.parseInt(experienceRaw, 10);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 60) {
      return { error: "EXPERIENCE_RANGE" };
    }
    experienceYears = parsed;
  }

  const { session } = authResult;

  await prisma.freelancerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, website, experienceYears },
    update: { website, experienceYears },
  });

  revalidateProfilePaths(session.user.id);
  return { success: true };
}
