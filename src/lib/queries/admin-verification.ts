import { prisma } from "@/lib/prisma";

export type AdminVerificationItem = {
  userId: string;
  name: string | null;
  email: string;
  title: string | null;
  verificationStatus: string;
  verificationRequestedAt: string;
  skillCount: number;
  completedProjects: number;
  rating: number;
};

export async function getPendingProfileVerifications(): Promise<
  AdminVerificationItem[]
> {
  const profiles = await prisma.freelancerProfile.findMany({
    where: { verificationStatus: "PENDING" },
    orderBy: { verificationRequestedAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          rating: true,
          contractsAsFreelancer: {
            where: { status: "RELEASED" },
            select: { id: true },
          },
        },
      },
      skills: { select: { id: true } },
    },
  });

  return profiles.map((profile) => ({
    userId: profile.user.id,
    name: profile.user.name,
    email: profile.user.email,
    title: profile.title,
    verificationStatus: profile.verificationStatus,
    verificationRequestedAt:
      profile.verificationRequestedAt?.toISOString() ?? "",
    skillCount: profile.skills.length,
    completedProjects: profile.user.contractsAsFreelancer.length,
    rating: profile.user.rating,
  }));
}

export async function getPendingVerificationCount(): Promise<number> {
  return prisma.freelancerProfile.count({
    where: { verificationStatus: "PENDING" },
  });
}
