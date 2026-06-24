import { EscrowError } from "@/lib/escrow-errors";
import { getCommissionRate } from "@/lib/commission";
import { prisma } from "@/lib/prisma";

export async function atomicFundContestPrize(
  projectId: string,
  clientId: string,
  amount: number,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        id: projectId,
        clientId,
        kind: "CONTEST",
        status: "OPEN",
      },
      select: { id: true, budget: true, currency: true, contestEscrow: true },
    });

    if (!project) {
      throw new EscrowError("PROJECT_NOT_FOUND");
    }

    if (project.contestEscrow) {
      throw new EscrowError("CONTEST_ALREADY_FUNDED");
    }

    const prizeAmount = amount > 0 ? amount : Number(project.budget ?? 0);
    if (prizeAmount <= 0) {
      throw new EscrowError("BUDGET_MUST_BE_POSITIVE");
    }

    const balanceResult = await tx.user.updateMany({
      where: { id: clientId, balance: { gte: prizeAmount } },
      data: { balance: { decrement: prizeAmount } },
    });

    if (balanceResult.count === 0) {
      throw new EscrowError("ESCROW_INSUFFICIENT_BALANCE");
    }

    await tx.contestEscrow.create({
      data: {
        projectId,
        amount: prizeAmount,
        currency: project.currency,
      },
    });
  });
}

export async function atomicSelectContestWinner(
  projectId: string,
  clientId: string,
  entryId: string,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        id: projectId,
        clientId,
        kind: "CONTEST",
        status: "OPEN",
      },
      include: {
        contestEscrow: true,
        contract: true,
      },
    });

    if (!project?.contestEscrow) {
      throw new EscrowError("CONTEST_PRIZE_NOT_FUNDED");
    }

    if (project.contract) {
      throw new EscrowError("CONTEST_WINNER_ALREADY_SELECTED");
    }

    const entry = await tx.contestEntry.findFirst({
      where: {
        id: entryId,
        projectId,
        status: "SUBMITTED",
      },
    });

    if (!entry) {
      throw new EscrowError("CONTEST_ENTRY_NOT_FOUND");
    }

    const amount = Number(project.contestEscrow.amount);
    const commissionRate = getCommissionRate();
    const commission = Math.round(amount * commissionRate * 100) / 100;
    const freelancerPayout = Math.round((amount - commission) * 100) / 100;

    const contract = await tx.contract.create({
      data: {
        projectId,
        clientId,
        freelancerId: entry.freelancerId,
        amount,
        commission,
        freelancerPayout,
        status: "ESCROWED",
      },
    });

    await tx.conversation.create({
      data: {
        projectId,
        clientId,
        freelancerId: entry.freelancerId,
      },
    });

    await tx.contestEntry.updateMany({
      where: { projectId, status: "SUBMITTED" },
      data: { status: "REJECTED" },
    });

    await tx.contestEntry.update({
      where: { id: entryId },
      data: { status: "WINNER" },
    });

    await tx.user.update({
      where: { id: entry.freelancerId },
      data: { balance: { increment: freelancerPayout } },
    });

    await tx.contract.update({
      where: { id: contract.id },
      data: { status: "RELEASED", releasedPayout: freelancerPayout },
    });

    await tx.project.update({
      where: { id: projectId },
      data: { status: "CLOSED" },
    });

    await tx.contestEscrow.delete({ where: { projectId } });

    if (commission > 0) {
      await tx.payment.create({
        data: {
          userId: clientId,
          amount: commission,
          type: "COMMISSION",
          status: "COMPLETED",
          metadata: { projectId, contractId: contract.id, contest: true },
        },
      });
    }

    return { contractId: contract.id, freelancerId: entry.freelancerId };
  });
}
