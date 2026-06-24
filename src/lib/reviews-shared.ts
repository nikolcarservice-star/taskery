import type { Role } from "@/generated/prisma/client";

export type ReviewRow = {
  id: string;
  rating: number;
  text: string | null;
  createdAt: Date;
  fromUser: { id: string; name: string | null; role: Role };
  toUser: { id: string; name: string | null; role: Role };
  contract: {
    project: { title: string; slug: string };
  };
};

export type PendingReviewRow = {
  contractId: string;
  projectTitle: string;
  projectSlug: string;
  partnerName: string | null;
  partnerRole: Role;
  completedAt: Date;
};

export const REVIEWER_ROLE_LABELS: Record<Role, string> = {
  CLIENT: "Заказчик",
  FREELANCER: "Фрилансер",
  ADMIN: "Администратор",
};

export function reviewTargetLabel(partnerRole: Role): string {
  return partnerRole === "FREELANCER"
    ? "исполнителя"
    : partnerRole === "CLIENT"
      ? "заказчика"
      : "участника сделки";
}

export function isMutualReviewComplete(reviewCount: number): boolean {
  return reviewCount >= 2;
}

export function reviewsVisibleToParticipant<T extends { fromUserId: string }>(
  reviews: T[],
  currentUserId: string,
): T[] {
  if (isMutualReviewComplete(reviews.length)) {
    return reviews;
  }

  return reviews.filter((review) => review.fromUserId === currentUserId);
}
