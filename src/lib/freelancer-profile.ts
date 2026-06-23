import {
  type FreelancerProfileData,
  type LegalStatus,
  type WorkAvailability,
} from "@/lib/freelancer-profile-shared";
import { prisma } from "@/lib/prisma";

export async function getFreelancerProfileData(
  userId: string,
): Promise<FreelancerProfileData> {
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { bio: true },
    }),
    prisma.freelancerProfile.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: {
        skills: { select: { id: true } },
      },
    }),
  ]);

  return {
    userId,
    bio: user?.bio ?? null,
    workAvailability: profile.workAvailability as WorkAvailability,
    title: profile.title,
    hourlyRate: profile.hourlyRate?.toString() ?? null,
    skillIds: profile.skills.map((skill) => skill.id),
    legalStatus: profile.legalStatus as LegalStatus | null,
    taxId: profile.taxId,
    website: profile.website,
    experienceYears: profile.experienceYears,
  };
}

export async function getAllSkills() {
  return prisma.skill.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
