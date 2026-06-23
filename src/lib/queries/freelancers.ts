import { Prisma } from "@/generated/prisma/client";

export type FreelancerSearchParams = {
  q?: string;
  skill?: string;
  sort?: string;
};

export function buildFreelancerWhere(
  params: FreelancerSearchParams,
): Prisma.UserWhereInput {
  const conditions: Prisma.UserWhereInput[] = [
    { role: { in: ["FREELANCER", "ADMIN"] } },
    { freelancerProfile: { isNot: null } },
  ];

  const query = params.q?.trim();
  if (query) {
    conditions.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { bio: { contains: query, mode: "insensitive" } },
        {
          freelancerProfile: {
            title: { contains: query, mode: "insensitive" },
          },
        },
      ],
    });
  }

  if (params.skill) {
    conditions.push({
      freelancerProfile: {
        skills: { some: { id: params.skill } },
      },
    });
  }

  return { AND: conditions };
}

export function getFreelancerOrderBy(
  sort?: string,
): Prisma.UserOrderByWithRelationInput[] {
  switch (sort) {
    case "rate_asc":
      return [{ freelancerProfile: { hourlyRate: "asc" } }];
    case "rate_desc":
      return [{ freelancerProfile: { hourlyRate: "desc" } }];
    case "name":
      return [{ name: "asc" }];
    default:
      return [
        { subscriptionPlan: "desc" },
        { featuredUntil: "desc" },
        { rating: "desc" },
        { createdAt: "desc" },
      ];
  }
}
