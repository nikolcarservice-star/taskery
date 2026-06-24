"use server";

import { actionError } from "@/lib/action-errors";
import {
  notifyAdminsNewProjectPending,
  publishProjectAfterApproval,
} from "@/lib/actions/admin-project-moderation";
import { auth } from "@/lib/auth";
import { validateCategoryMinBudget } from "@/lib/category-min-budget";
import {
  atomicFundContestPrize,
  atomicSelectContestWinner,
} from "@/lib/contest-ops";
import { uploadChatAttachment } from "@/lib/chat-attachment-storage";
import { mapEscrowError } from "@/lib/escrow-ops";
import {
  defaultCurrency,
  isSupportedCurrency,
  normalizeMoneyAmount,
  parseMoneyAmount,
} from "@/lib/i18n/currencies";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { projectPreModerationEnabled } from "@/lib/platform-config";
import { prisma } from "@/lib/prisma";
import { generateUniqueProjectSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export type ContestActionState = {
  error?: string;
  success?: boolean;
  projectSlug?: string;
  pendingModeration?: boolean;
};

export async function createContest(
  _prev: ContestActionState,
  formData: FormData,
): Promise<ContestActionState & { projectSlug?: string; pendingModeration?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");
  if (session.user.role !== "CLIENT" && session.user.role !== "ADMIN") {
    return actionError("CLIENTS_ONLY_PUBLISH");
  }

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const categoryId = (formData.get("categoryId") as string | null)?.trim();
  const budgetRaw = (formData.get("budget") as string | null)?.trim();
  const currencyRaw =
    (formData.get("currency") as string | null)?.trim() || defaultCurrency;
  const submissionDeadlineRaw = (
    formData.get("submissionDeadline") as string | null
  )?.trim();

  if (!isSupportedCurrency(currencyRaw)) return actionError("INVALID_CURRENCY");
  if (!title || title.length < 5) return actionError("TITLE_TOO_SHORT");
  if (!description || description.length < 20) {
    return actionError("DESCRIPTION_TOO_SHORT");
  }
  if (!categoryId) return actionError("CATEGORY_REQUIRED");
  if (!budgetRaw) return actionError("CONTEST_BUDGET_REQUIRED");

  const parsed = parseMoneyAmount(budgetRaw);
  if (parsed === null || parsed <= 0) {
    return actionError("BUDGET_MUST_BE_POSITIVE");
  }

  const budget = normalizeMoneyAmount(parsed, currencyRaw);
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return actionError("CATEGORY_NOT_FOUND");

  const minCheck = await validateCategoryMinBudget(categoryId, currencyRaw, budget);
  if (!minCheck.ok) {
    return actionError("BUDGET_MUST_BE_POSITIVE");
  }

  let submissionDeadline: Date | null = null;
  if (submissionDeadlineRaw) {
    submissionDeadline = new Date(submissionDeadlineRaw);
    if (Number.isNaN(submissionDeadline.getTime())) {
      return actionError("INVALID_DEADLINE");
    }
    if (submissionDeadline < new Date()) {
      return actionError("DEADLINE_IN_PAST");
    }
  }

  const slug = await generateUniqueProjectSlug(title, async (s) => {
    const found = await prisma.project.findUnique({ where: { slug: s } });
    return Boolean(found);
  });
  const pending = projectPreModerationEnabled;

  const project = await prisma.project.create({
    data: {
      slug,
      clientId: session.user.id,
      categoryId,
      title,
      description,
      budget,
      currency: currencyRaw,
      kind: "CONTEST",
      status: pending ? "PENDING_MODERATION" : "OPEN",
      submissionDeadline,
    },
  });

  if (pending) {
    await notifyAdminsNewProjectPending(project.id, project.title);
    await createLocalizedUserNotification({
      userId: session.user.id,
      type: "PROJECT_MATCH",
      template: "PROJECT_MODERATION_PENDING",
      variables: { projectTitle: project.title },
      link: "/client/projects",
    });
    revalidatePath("/client/projects");
    return { success: true, projectSlug: slug, pendingModeration: true };
  }

  await publishProjectAfterApproval({
    id: project.id,
    clientId: project.clientId,
    slug: project.slug,
    title: project.title,
  });
  revalidatePath("/contests");
  return { success: true, projectSlug: slug };
}

export async function fundContestPrize(
  _prev: ContestActionState,
  formData: FormData,
): Promise<ContestActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { slug: true, clientId: true, budget: true },
  });

  if (!project) return actionError("PROJECT_NOT_FOUND");
  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }

  try {
    await atomicFundContestPrize(
      projectId,
      project.clientId,
      Number(project.budget ?? 0),
    );
  } catch (error) {
    return { error: mapEscrowError(error) };
  }

  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/contests");
  return { success: true };
}

export async function submitContestEntry(
  _prev: ContestActionState,
  formData: FormData,
): Promise<ContestActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");
  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return actionError("FREELANCERS_ONLY");
  }

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();

  if (!projectId) return actionError("PROJECT_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { contestEscrow: true, contract: true },
  });

  if (!project || project.kind !== "CONTEST") {
    return actionError("PROJECT_NOT_FOUND");
  }
  if (project.status !== "OPEN") return actionError("CONTEST_NOT_OPEN");
  if (!project.contestEscrow) return actionError("CONTEST_PRIZE_NOT_FUNDED");
  if (project.contract) return actionError("CONTEST_WINNER_ALREADY_SELECTED");
  if (
    project.submissionDeadline &&
    project.submissionDeadline < new Date()
  ) {
    return actionError("CONTEST_SUBMISSIONS_CLOSED");
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return actionError("FILE_REQUIRED");

  let entry = await prisma.contestEntry.findUnique({
    where: {
      projectId_freelancerId: {
        projectId,
        freelancerId: session.user.id,
      },
    },
  });

  if (entry?.status === "WINNER") {
    return actionError("CONTEST_WINNER_ALREADY_SELECTED");
  }

  if (!entry) {
    entry = await prisma.contestEntry.create({
      data: {
        projectId,
        freelancerId: session.user.id,
        title: title || null,
        description: description || null,
        status: "DRAFT",
      },
    });
  }

  const uploaded: Array<{
    url: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }> = [];
  for (const file of files.slice(0, 5)) {
    const stored = await uploadChatAttachment(
      file,
      `contests/${projectId}/${entry.id}`,
    );
    uploaded.push(stored);
  }

  await prisma.$transaction(async (tx) => {
    await tx.contestEntryFile.deleteMany({ where: { entryId: entry!.id } });
    await tx.contestEntryFile.createMany({
      data: uploaded.map((file) => ({
        entryId: entry!.id,
        url: file.url,
        filename: file.filename,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
      })),
    });

    await tx.contestEntry.update({
      where: { id: entry!.id },
      data: {
        title: title || entry!.title,
        description: description || entry!.description,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });
  });

  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/contests");
  return { success: true };
}

export async function selectContestWinner(
  _prev: ContestActionState,
  formData: FormData,
): Promise<ContestActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const entryId = (formData.get("entryId") as string | null)?.trim();
  if (!projectId || !entryId) return actionError("CONTEST_ENTRY_NOT_FOUND");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { slug: true, clientId: true },
  });

  if (!project) return actionError("PROJECT_NOT_FOUND");
  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }

  try {
    await atomicSelectContestWinner(projectId, project.clientId, entryId);
  } catch (error) {
    return { error: mapEscrowError(error) };
  }

  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/contests");
  revalidatePath("/messages");
  return { success: true };
}
