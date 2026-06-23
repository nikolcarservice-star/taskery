import { prisma } from "@/lib/prisma";

export class EscrowError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_FOUND"
      | "INVALID_STATUS"
      | "INSUFFICIENT_BALANCE"
      | "ALREADY_PROCESSED",
  ) {
    super(message);
    this.name = "EscrowError";
  }
}

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
      throw new EscrowError(
        "Средства по этому проекту уже внесены",
        "ALREADY_PROCESSED",
      );
    }

    const balanceResult = await tx.user.updateMany({
      where: { id: clientId, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });

    if (balanceResult.count === 0) {
      throw new EscrowError(
        `Недостаточно средств. Нужно ${amount.toLocaleString("uk-UA")} ₴. Пополните баланс.`,
        "INSUFFICIENT_BALANCE",
      );
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
      throw new EscrowError("Средства уже обработаны", "ALREADY_PROCESSED");
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
) {
  return prisma.$transaction(async (tx) => {
    const contractResult = await tx.contract.updateMany({
      where: { id: contractId, status: "ESCROWED" },
      data: { status: "REFUNDED" },
    });

    if (contractResult.count === 0) {
      throw new EscrowError("Средства уже обработаны", "ALREADY_PROCESSED");
    }

    await tx.user.update({
      where: { id: clientId },
      data: { balance: { increment: amount } },
    });

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
      throw new EscrowError("Средства уже обработаны", "ALREADY_PROCESSED");
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
      throw new EscrowError("Средства уже обработаны", "INVALID_STATUS");
    }

    const projectResult = await tx.project.updateMany({
      where: { id: projectId, status: "IN_PROGRESS" },
      data: { status: "UNDER_DISPUTE" },
    });

    if (projectResult.count === 0) {
      throw new EscrowError(
        "Спор можно открыть только для проекта в работе",
        "INVALID_STATUS",
      );
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
            kind: "DISPUTE_ADMIN_NOTE",
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
