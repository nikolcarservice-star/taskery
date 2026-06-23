import { prisma } from "@/lib/prisma";

/**
 * Permanently erases a user and all related personal data (GDPR Right to be Forgotten).
 * Prisma cascade deletes: FreelancerProfile, PortfolioItems, Projects, Bids,
 * Contracts, and Reviews linked to this user.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}
