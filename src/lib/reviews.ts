import type {
  PendingReviewRow,
  ReviewRow,
} from "@/lib/reviews-shared";
import { prisma } from "@/lib/prisma";

const reviewListSelect = {
  id: true,
  rating: true,
  text: true,
  createdAt: true,
  fromUser: { select: { id: true, name: true, role: true } },
  toUser: { select: { id: true, name: true, role: true } },
  contract: {
    select: {
      project: { select: { title: true, slug: true } },
    },
  },
} as const;

function toReviewRow(
  review: {
    id: string;
    rating: number;
    text: string | null;
    createdAt: Date;
    fromUser: { id: string; name: string | null; role: ReviewRow["fromUser"]["role"] };
    toUser: { id: string; name: string | null; role: ReviewRow["toUser"]["role"] };
    contract: { project: { title: string; slug: string } };
  },
): ReviewRow {
  return {
    id: review.id,
    rating: review.rating,
    text: review.text,
    createdAt: review.createdAt,
    fromUser: review.fromUser,
    toUser: review.toUser,
    contract: { project: review.contract.project },
  };
}

export async function getReviewsReceived(userId: string): Promise<ReviewRow[]> {
  const reviews = await prisma.review.findMany({
    where: { toUserId: userId },
    select: reviewListSelect,
    orderBy: { createdAt: "desc" },
  });

  return reviews.map(toReviewRow);
}

export async function getReviewsGiven(userId: string): Promise<ReviewRow[]> {
  const reviews = await prisma.review.findMany({
    where: { fromUserId: userId },
    select: reviewListSelect,
    orderBy: { createdAt: "desc" },
  });

  return reviews.map(toReviewRow);
}

export async function getPendingReviews(userId: string): Promise<PendingReviewRow[]> {
  const contracts = await prisma.contract.findMany({
    where: {
      status: "RELEASED",
      project: { status: "CLOSED" },
      OR: [{ clientId: userId }, { freelancerId: userId }],
      reviews: { none: { fromUserId: userId } },
    },
    select: {
      id: true,
      clientId: true,
      updatedAt: true,
      project: { select: { title: true, slug: true } },
      client: { select: { id: true, name: true, role: true } },
      freelancer: { select: { id: true, name: true, role: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return contracts.map((contract) => {
    const isClient = contract.clientId === userId;
    const partner = isClient ? contract.freelancer : contract.client;

    return {
      contractId: contract.id,
      projectTitle: contract.project.title,
      projectSlug: contract.project.slug,
      partnerName: partner.name,
      partnerRole: partner.role,
      completedAt: contract.updatedAt,
    };
  });
}

export async function getUserReviewStats(userId: string) {
  const [receivedCount, givenCount, pendingCount, user] = await Promise.all([
    prisma.review.count({ where: { toUserId: userId } }),
    prisma.review.count({ where: { fromUserId: userId } }),
    prisma.contract.count({
      where: {
        status: "RELEASED",
        project: { status: "CLOSED" },
        OR: [{ clientId: userId }, { freelancerId: userId }],
        reviews: { none: { fromUserId: userId } },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true },
    }),
  ]);

  return {
    receivedCount,
    givenCount,
    pendingCount,
    rating: user?.rating ?? 0,
  };
}
