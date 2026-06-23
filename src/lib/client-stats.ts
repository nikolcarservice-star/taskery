import type { ClientOrderStats } from "@/lib/client-stats-shared";
import { ContractStatus, ProjectStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getClientOrderStats(
  clientId: string,
): Promise<ClientOrderStats> {
  const [completedProjects, uncompletedProjects, reviewsReceived, user] =
    await Promise.all([
      prisma.project.count({
        where: {
          clientId,
          status: ProjectStatus.CLOSED,
          contract: { status: ContractStatus.RELEASED },
        },
      }),
      prisma.project.count({
        where: {
          clientId,
          OR: [
            { status: ProjectStatus.UNDER_DISPUTE },
            { contract: { status: ContractStatus.REFUNDED } },
            {
              status: ProjectStatus.CLOSED,
              OR: [
                { contract: { is: null } },
                {
                  contract: {
                    status: {
                      notIn: [ContractStatus.RELEASED],
                    },
                  },
                },
              ],
            },
          ],
        },
      }),
      prisma.review.count({ where: { toUserId: clientId } }),
      prisma.user.findUnique({
        where: { id: clientId },
        select: { rating: true },
      }),
    ]);

  return {
    completedProjects,
    uncompletedProjects,
    reviewsReceived,
    rating: user?.rating ?? 0,
  };
}
