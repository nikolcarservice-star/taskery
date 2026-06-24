import { EscrowError } from "@/lib/escrow-errors";
import { prisma } from "@/lib/prisma";

export { EscrowError, mapEscrowError } from "@/lib/escrow-errors";

export async function atomicFundContract(
  contractId: string,
  clientId: string,
  amount: number,
) {
  return prisma.$transaction(async (tx) => {
    const contractResult = await tx.contract.updateMany({
      where: { id: contractId, clientId, status: "AWAITING_FUNDING" },
      data: { status: "ESCROWED" },
    });

    if (contractResult.count === 0) {
      throw new EscrowError("ESCROW_ALREADY_FUNDED");
    }

    const balanceResult = await tx.user.updateMany({
      where: { id: clientId, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });

    if (balanceResult.count === 0) {
      throw new EscrowError("ESCROW_INSUFFICIENT_BALANCE");
    }
  });
}

export async function atomicReleaseContract(
  contractId: string,
  projectId: string,
  freelancerId: string,
  payout: number,
  commission: number,
  clientId: string,
) {
  return prisma.$transaction(async (tx) => {
    const contractResult = await tx.contract.updateMany({
      where: { id: contractId, status: "ESCROWED" },
      data: { status: "RELEASED" },
    });

    if (contractResult.count === 0) {
      throw new EscrowError("FUNDS_ALREADY_PROCESSED");
    }

    await tx.user.update({
      where: { id: freelancerId },
      data: { balance: { increment: payout } },
    });

    await tx.project.updateMany({
      where: { id: projectId, status: { in: ["IN_PROGRESS", "UNDER_DISPUTE"] } },
      data: { status: "CLOSED" },
    });

    if (commission > 0) {
      await tx.payment.create({
        data: {
          userId: clientId,
          amount: commission,
          type: "COMMISSION",
          status: "COMPLETED",
          metadata: { projectId, contractId },
        },
      });
    }
  });
}

export async function atomicRefundContract(
  contractId: string,
  projectId: string,
  clientId: string,
  amount: number,
  options?: { creditBalance?: boolean },
) {
  const creditBalance = options?.creditBalance ?? true;

  return prisma.$transaction(async (tx) => {
    const contractResult = await tx.contract.updateMany({
      where: { id: contractId, status: "ESCROWED" },
      data: { status: "REFUNDED" },
    });

    if (contractResult.count === 0) {
      throw new EscrowError("FUNDS_ALREADY_PROCESSED");
    }

    if (creditBalance) {
      await tx.user.update({
        where: { id: clientId },
        data: { balance: { increment: amount } },
      });
    }

    await tx.project.updateMany({
      where: { id: projectId, status: "UNDER_DISPUTE" },
      data: { status: "CLOSED" },
    });
  });
}

export async function atomicReleaseDispute(
  contractId: string,
  projectId: string,
  freelancerId: string,
  payout: number,
  commission: number,
  clientId: string,
) {
  return prisma.$transaction(async (tx) => {
    const contractResult = await tx.contract.updateMany({
      where: { id: contractId, status: "ESCROWED" },
      data: { status: "RELEASED" },
    });

    if (contractResult.count === 0) {
      throw new EscrowError("FUNDS_ALREADY_PROCESSED");
    }

    await tx.user.update({
      where: { id: freelancerId },
      data: { balance: { increment: payout } },
    });

    await tx.project.updateMany({
      where: { id: projectId, status: "UNDER_DISPUTE" },
      data: { status: "CLOSED" },
    });

    if (commission > 0) {
      await tx.payment.create({
        data: {
          userId: clientId,
          amount: commission,
          type: "COMMISSION",
          status: "COMPLETED",
          metadata: { projectId, contractId, dispute: true },
        },
      });
    }
  });
}

export function calculateSplitDisputeAmounts(
  totalAmount: number,
  totalCommission: number,
  totalPayout: number,
  freelancerPercent: number,
) {
  if (freelancerPercent <= 0 || freelancerPercent >= 100) {
    throw new EscrowError("DISPUTE_SPLIT_PERCENT_RANGE");
  }

  const payout =
    Math.round(((totalPayout * freelancerPercent) / 100) * 100) / 100;
  const commission =
    Math.round(((totalCommission * freelancerPercent) / 100) * 100) / 100;
  const clientRefund =
    Math.round((totalAmount - payout - commission) * 100) / 100;

  if (clientRefund < 0) {
    throw new EscrowError("DISPUTE_SPLIT_INVALID");
  }

  return { payout, commission, clientRefund };
}

export async function atomicSplitDispute(
  contractId: string,
  projectId: string,
  freelancerId: string,
  clientId: string,
  totalAmount: number,
  totalCommission: number,
  totalPayout: number,
  freelancerPercent: number,
  options?: { clientBalanceRefund?: number },
) {
  const { payout, commission, clientRefund } = calculateSplitDisputeAmounts(
    totalAmount,
    totalCommission,
    totalPayout,
    freelancerPercent,
  );
  const clientBalanceRefund = options?.clientBalanceRefund ?? clientRefund;

  return prisma.$transaction(async (tx) => {
    const contractResult = await tx.contract.updateMany({
      where: { id: contractId, status: "ESCROWED" },
      data: { status: "RELEASED" },
    });

    if (contractResult.count === 0) {
      throw new EscrowError("FUNDS_ALREADY_PROCESSED");
    }

    if (payout > 0) {
      await tx.user.update({
        where: { id: freelancerId },
        data: { balance: { increment: payout } },
      });
    }

    if (clientBalanceRefund > 0) {
      await tx.user.update({
        where: { id: clientId },
        data: { balance: { increment: clientBalanceRefund } },
      });
    }

    await tx.project.updateMany({
      where: { id: projectId, status: "UNDER_DISPUTE" },
      data: { status: "CLOSED" },
    });

    if (commission > 0) {
      await tx.payment.create({
        data: {
          userId: clientId,
          amount: commission,
          type: "COMMISSION",
          status: "COMPLETED",
          metadata: {
            projectId,
            contractId,
            dispute: true,
            split: true,
            freelancerPercent,
          },
        },
      });
    }
  });
}

export async function atomicOpenDispute(
  projectId: string,
  contractId: string,
  chat?: {
    conversationId: string;
    openedById: string;
    adminNote: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const contract = await tx.contract.findFirst({
      where: { id: contractId, projectId, status: "ESCROWED" },
      select: { id: true },
    });

    if (!contract) {
      throw new EscrowError("FUNDS_ALREADY_PROCESSED");
    }

    const projectResult = await tx.project.updateMany({
      where: { id: projectId, status: "IN_PROGRESS" },
      data: { status: "UNDER_DISPUTE" },
    });

    if (projectResult.count === 0) {
      throw new EscrowError("DISPUTE_OPEN_IN_PROGRESS_ONLY");
    }

    if (chat) {
      await tx.message.createMany({
        data: [
          {
            conversationId: chat.conversationId,
            kind: "DISPUTE_OPENED",
            senderId: chat.openedById,
            content: "",
          },
          {
            conversationId: chat.conversationId,
            kind: "DISPUTE_REASON",
            senderId: chat.openedById,
            content: chat.adminNote,
          },
        ],
      });

      await tx.conversation.update({
        where: { id: chat.conversationId },
        data: { updatedAt: new Date() },
      });
    }
  });
}
