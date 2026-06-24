import { EscrowError } from "@/lib/escrow-errors";
import { prisma } from "@/lib/prisma";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function atomicReleaseMilestone(
  milestoneId: string,
  clientId: string,
) {
  return prisma.$transaction(async (tx) => {
    const milestone = await tx.contractMilestone.findUnique({
      where: { id: milestoneId },
      include: {
        contract: {
          include: {
            project: { select: { id: true, status: true } },
            milestones: { select: { id: true, status: true, amount: true } },
          },
        },
      },
    });

    if (!milestone || milestone.contract.clientId !== clientId) {
      throw new EscrowError("MILESTONE_NOT_FOUND");
    }

    if (milestone.status !== "PENDING") {
      throw new EscrowError("MILESTONE_ALREADY_RELEASED");
    }

    if (milestone.contract.status !== "ESCROWED") {
      throw new EscrowError("FUNDS_ALREADY_PROCESSED");
    }

    const contract = milestone.contract;
    const totalAmount = Number(contract.amount);
    const totalCommission = Number(contract.commission);
    const totalPayout = Number(contract.freelancerPayout);
    const milestoneAmount = Number(milestone.amount);

    const payout = roundMoney((totalPayout * milestoneAmount) / totalAmount);
    const commission = roundMoney((totalCommission * milestoneAmount) / totalAmount);

    await tx.contractMilestone.update({
      where: { id: milestoneId },
      data: { status: "RELEASED", releasedAt: new Date() },
    });

    await tx.user.update({
      where: { id: contract.freelancerId },
      data: { balance: { increment: payout } },
    });

    const newReleasedPayout = roundMoney(Number(contract.releasedPayout) + payout);

    const pendingMilestones = contract.milestones.filter(
      (item) => item.id !== milestoneId && item.status === "PENDING",
    );

    if (pendingMilestones.length === 0) {
      await tx.contract.update({
        where: { id: contract.id },
        data: { status: "RELEASED", releasedPayout: newReleasedPayout },
      });

      await tx.project.updateMany({
        where: {
          id: contract.projectId,
          status: { in: ["IN_PROGRESS", "UNDER_DISPUTE"] },
        },
        data: { status: "CLOSED" },
      });
    } else {
      await tx.contract.update({
        where: { id: contract.id },
        data: { releasedPayout: newReleasedPayout },
      });
    }

    if (commission > 0) {
      await tx.payment.create({
        data: {
          userId: clientId,
          amount: commission,
          type: "COMMISSION",
          status: "COMPLETED",
          metadata: {
            projectId: contract.projectId,
            contractId: contract.id,
            milestoneId,
          },
        },
      });
    }
  });
}
