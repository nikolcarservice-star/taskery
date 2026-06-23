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

export function isActiveClientContract(
  contract: ActiveContractCandidate,
): boolean {
  return (
    ACTIVE_CONTRACT_STATUSES.has(contract.status) &&
    ACTIVE_PROJECT_STATUSES.has(contract.project.status)
  );
}

export async function hasActiveClientProjects(
  clientId: string,
): Promise<boolean> {
  const contracts = await prisma.contract.findMany({
    where: { clientId },
    select: {
      status: true,
      project: { select: { status: true } },
    },
  });

  return contracts.some(isActiveClientContract);
}

const activeContractsInclude = {
  project: {
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      currency: true,
    },
  },
  freelancer: { select: { id: true, name: true } },
} satisfies Prisma.ContractInclude;

export type ActiveClientContractWithDetails = Prisma.ContractGetPayload<{
  include: typeof activeContractsInclude;
}>;

export async function getActiveClientContracts(
  clientId: string,
  orderBy: Prisma.ContractOrderByWithRelationInput = { createdAt: "desc" },
): Promise<ActiveClientContractWithDetails[]> {
  return prisma.contract.findMany({
    where: {
      clientId,
      status: { in: [...ACTIVE_CONTRACT_STATUSES] },
      project: { status: { in: [...ACTIVE_PROJECT_STATUSES] } },
    },
    include: activeContractsInclude,
    orderBy,
  });
}
