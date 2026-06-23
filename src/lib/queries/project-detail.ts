import { type Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const projectDetailInclude = {
  category: { select: { name: true } },
  client: {
    select: {
      id: true,
      name: true,
      balance: true,
      avatar: true,
      rating: true,
      country: true,
      city: true,
      createdAt: true,
    },
  },
  contract: {
    include: {
      freelancer: { select: { id: true, name: true, avatar: true } },
      client: { select: { name: true } },
      reviews: {
        include: {
          fromUser: { select: { id: true, name: true, role: true } },
        },
      },
    },
  },
  conversation: {
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  },
  bids: {
    orderBy: { createdAt: "desc" },
    include: {
      freelancer: {
        select: {
          id: true,
          name: true,
          rating: true,
          avatar: true,
          subscriptionPlan: true,
          featuredUntil: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  },
  _count: { select: { bids: true } },
} satisfies Prisma.ProjectInclude;

export type ProjectDetailData = Prisma.ProjectGetPayload<{
  include: typeof projectDetailInclude;
}>;

export async function getProjectDetailById(
  projectId: string,
): Promise<ProjectDetailData | null> {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: projectDetailInclude,
  });
}
