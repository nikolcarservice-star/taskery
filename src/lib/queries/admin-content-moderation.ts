import { prisma } from "@/lib/prisma";

export type PendingPortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  freelancer: {
    userId: string;
    name: string | null;
    email: string;
  };
};

export type PendingAvatarItem = {
  userId: string;
  name: string | null;
  email: string;
  avatar: string | null;
  pendingAvatar: string;
};

export type ContentModerationOverview = {
  portfolio: PendingPortfolioItem[];
  avatars: PendingAvatarItem[];
};

export async function getContentModerationQueue(): Promise<ContentModerationOverview> {
  const [portfolio, avatars] = await Promise.all([
    prisma.portfolioItem.findMany({
      where: { moderationStatus: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        freelancerProfile: {
          select: {
            userId: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { pendingAvatar: { not: null }, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        pendingAvatar: true,
      },
      orderBy: { updatedAt: "asc" },
    }),
  ]);

  return {
    portfolio: portfolio.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt.toISOString(),
      freelancer: {
        userId: item.freelancerProfile.userId,
        name: item.freelancerProfile.user.name,
        email: item.freelancerProfile.user.email,
      },
    })),
    avatars: avatars
      .filter((user): user is typeof user & { pendingAvatar: string } =>
        Boolean(user.pendingAvatar),
      )
      .map((user) => ({
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        pendingAvatar: user.pendingAvatar,
      })),
  };
}
