"use server";

import { actionError } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { atomicReleaseMilestone } from "@/lib/milestone-ops";
import { mapEscrowError } from "@/lib/escrow-ops";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type MilestoneActionState = { error?: string; success?: boolean };

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function saveContractMilestones(
  _prev: MilestoneActionState,
  formData: FormData,
): Promise<MilestoneActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const titles = formData.getAll("milestoneTitle").map((v) => String(v).trim());
  const amounts = formData
    .getAll("milestoneAmount")
    .map((v) => Number(String(v).replace(",", ".")));

  if (titles.length === 0) return actionError("MILESTONE_TITLE_REQUIRED");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { contract: { include: { milestones: true } } },
  });

  if (!project?.contract) return actionError("CONTRACT_NOT_FOUND");
  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }
  if (project.contract.status !== "AWAITING_FUNDING") {
    return actionError("FUNDS_ALREADY_PROCESSED");
  }
  if (project.contract.milestones.some((m) => m.status === "RELEASED")) {
    return actionError("MILESTONE_ALREADY_RELEASED");
  }

  const contractAmount = Number(project.contract.amount);
  let sum = 0;
  const rows: { title: string; amount: number }[] = [];

  for (let i = 0; i < titles.length; i += 1) {
    const title = titles[i];
    const amount = amounts[i];
    if (!title) return actionError("MILESTONE_TITLE_REQUIRED");
    if (!Number.isFinite(amount) || amount <= 0) {
      return actionError("BUDGET_MUST_BE_POSITIVE");
    }
    rows.push({ title, amount: roundMoney(amount) });
    sum += amount;
  }

  if (roundMoney(sum) !== roundMoney(contractAmount)) {
    return actionError("MILESTONE_SUM_MISMATCH");
  }

  await prisma.$transaction(async (tx) => {
    await tx.contractMilestone.deleteMany({
      where: { contractId: project.contract!.id },
    });

    await tx.contractMilestone.createMany({
      data: rows.map((row, index) => ({
        contractId: project.contract!.id,
        title: row.title,
        amount: row.amount,
        sortOrder: index,
      })),
    });

    await tx.contract.update({
      where: { id: project.contract!.id },
      data: { useMilestones: true },
    });
  });

  revalidatePath(`/projects/${project.slug}`);
  return { success: true };
}

export async function releaseMilestone(
  _prev: MilestoneActionState,
  formData: FormData,
): Promise<MilestoneActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const milestoneId = (formData.get("milestoneId") as string | null)?.trim();
  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!milestoneId || !projectId) return actionError("MILESTONE_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { slug: true, clientId: true },
  });

  if (!project) return actionError("PROJECT_NOT_FOUND");
  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }

  try {
    await atomicReleaseMilestone(milestoneId, project.clientId);
  } catch (error) {
    return { error: mapEscrowError(error) };
  }

  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/client/work");
  revalidatePath("/dashboard/work");
  return { success: true };
}
