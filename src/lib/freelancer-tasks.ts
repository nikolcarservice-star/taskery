import {
  ContractStatus,
  ProjectStatus,
  type Contract,
  type Prisma,
  type Project,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const ACTIVE_CONTRACT_STATUSES = new Set<ContractStatus>([
  ContractStatus.AWAITING_FUNDING,
  ContractStatus.ESCROWED,
]);

const ACTIVE_PROJECT_STATUSES = new Set<ProjectStatus>([
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.UNDER_DISPUTE,
]);

type ActiveContractCandidate = Pick<Contract, "status"> & {
  project: Pick<Project, "status">;
};

export function activeFreelancerContractWhere(
  freelancerId: string,
): Prisma.ContractWhereInput {
  return {
    freelancerId,
    status: { in: [ContractStatus.AWAITING_FUNDING, ContractStatus.ESCROWED] },
    project: {
      status: { in: [ProjectStatus.IN_PROGRESS, ProjectStatus.UNDER_DISPUTE] },
    },
  };
}

export function isActiveFreelancerContract(
  contract: ActiveContractCandidate,
): boolean {
  return (
    ACTIVE_CONTRACT_STATUSES.has(contract.status) &&
    ACTIVE_PROJECT_STATUSES.has(contract.project.status)
  );
}

export async function hasActiveFreelancerTasks(
  freelancerId: string,
): Promise<boolean> {
  const count = await prisma.contract.count({
    where: activeFreelancerContractWhere(freelancerId),
  });

  return count > 0;
}

const activeFreelancerContractsInclude = {
  project: {
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      currency: true,
    },
  },
  client: { select: { name: true } },
} satisfies Prisma.ContractInclude;

export type ActiveFreelancerContractWithDetails = Prisma.ContractGetPayload<{
  include: typeof activeFreelancerContractsInclude;
}>;

export async function getActiveFreelancerContracts(
  freelancerId: string,
  options?: {
    orderBy?: Prisma.ContractOrderByWithRelationInput;
    take?: number;
  },
): Promise<ActiveFreelancerContractWithDetails[]> {
  return prisma.contract.findMany({
    where: activeFreelancerContractWhere(freelancerId),
    include: activeFreelancerContractsInclude,
    orderBy: options?.orderBy ?? { createdAt: "desc" },
    ...(options?.take ? { take: options.take } : {}),
  });
}
