"use server";

import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import { generateUniqueProjectSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendBidNotificationEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/seo";
import { validateCategoryMinBudget } from "@/lib/category-min-budget";
import {
  notifyAdminsNewProjectPending,
  publishProjectAfterApproval,
} from "@/lib/actions/admin-project-moderation";
import { projectPreModerationEnabled } from "@/lib/platform-config";
import {
  formatMoney,
  isSupportedCurrency,
  defaultCurrency,
  normalizeMoneyAmount,
  parseMoneyAmount,
} from "@/lib/i18n/currencies";

export type CreateProjectState = {
  error?: string;
  success?: boolean;
  projectId?: string;
  projectSlug?: string;
  pendingModeration?: boolean;
};

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  if (session.user.role !== "CLIENT" && session.user.role !== "ADMIN") {
    return { error: "CLIENTS_ONLY_PUBLISH" };
  }

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const categoryId = (formData.get("categoryId") as string | null)?.trim();
  const budgetNegotiable = formData.get("budgetNegotiable") === "on";
  const budgetRaw = (formData.get("budget") as string | null)?.trim();
  const currencyRaw = (formData.get("currency") as string | null)?.trim() || defaultCurrency;
  const deadlineRaw = (formData.get("deadline") as string | null)?.trim();

  if (!isSupportedCurrency(currencyRaw)) {
    return { error: "INVALID_CURRENCY" };
  }

  const currency = currencyRaw;

  if (!title || title.length < 5) {
    return { error: "TITLE_TOO_SHORT" };
  }

  if (!description || description.length < 20) {
    return { error: "DESCRIPTION_TOO_SHORT" };
  }

  if (!categoryId) {
    return { error: "CATEGORY_REQUIRED" };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { error: "CATEGORY_NOT_FOUND" };
  }

  let budget: number | null = null;

  if (!budgetNegotiable) {
    if (!budgetRaw) {
      return { error: "BUDGET_OR_NEGOTIABLE_REQUIRED" };
    }

    const parsed = parseMoneyAmount(budgetRaw);
    if (parsed === null || parsed <= 0) {
      return { error: "BUDGET_MUST_BE_POSITIVE" };
    }

    budget = normalizeMoneyAmount(parsed, currency);

    const minCheck = await validateCategoryMinBudget(
      categoryId,
      currency,
      budget,
    );
    if (!minCheck.ok) {
      return {
        error: `Минимальный бюджет для этой категории — ${formatMoney(minCheck.minAmount, minCheck.currency)}`,
      };
    }
  }

  let deadline: Date | null = null;
  if (deadlineRaw) {
    deadline = new Date(deadlineRaw);
    if (Number.isNaN(deadline.getTime())) {
      return { error: "INVALID_DEADLINE" };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      return { error: "DEADLINE_IN_PAST" };
    }
  }

  const slug = await generateUniqueProjectSlug(title, async (s) => {
    const found = await prisma.project.findUnique({ where: { slug: s } });
    return Boolean(found);
  });

  const project = await prisma.project.create({
    data: {
      slug,
      clientId: session.user.id,
      title,
      description,
      categoryId,
      budget,
      currency,
      deadline,
      status: projectPreModerationEnabled ? "PENDING_MODERATION" : "OPEN",
    },
  });

  if (projectPreModerationEnabled) {
    await notifyAdminsNewProjectPending(project.id, project.title);

    await createLocalizedUserNotification({
      userId: session.user.id,
      type: "USER_WARNING",
      template: "PROJECT_MODERATION_PENDING",
      variables: { projectTitle: project.title },
      link: "/client/projects",
    });
  } else {
    await publishProjectAfterApproval({
      id: project.id,
      slug: project.slug,
      clientId: project.clientId,
      title: project.title,
    });
  }

  revalidatePath("/projects/my");
  revalidatePath("/client/projects");
  revalidatePath("/client");
  revalidatePath("/projects");
  revalidatePath("/notifications");
  revalidatePath(`/projects/${project.slug}`);
  return {
    success: true,
    projectId: project.id,
    projectSlug: project.slug,
    pendingModeration: projectPreModerationEnabled,
  };
}

export type UpdateProjectState = { error?: string; success?: boolean };

export async function updateProject(
  _prevState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const categoryId = (formData.get("categoryId") as string | null)?.trim();
  const deadlineRaw = (formData.get("deadline") as string | null)?.trim();

  if (!projectId || !title || !description) {
    return { error: "REQUIRED_FIELDS_MISSING" };
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "PROJECT_NOT_FOUND" };
  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "ACCESS_DENIED" };
  }
  if (project.status !== "OPEN") {
    return { error: "EDIT_OPEN_PROJECT_ONLY" };
  }

  let deadline: Date | null = project.deadline;
  if (deadlineRaw) {
    deadline = new Date(deadlineRaw);
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { title, description, categoryId: categoryId || null, deadline },
  });

  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/projects/my");
  revalidatePath("/client/projects");
  revalidatePath("/client");
  return { success: true };
}

export async function closeProject(
  _prevState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const projectId = (formData.get("projectId") as string | null)?.trim();
  if (!projectId) return { error: "PROJECT_NOT_FOUND" };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "PROJECT_NOT_FOUND" };
  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "ACCESS_DENIED" };
  }
  if (project.status !== "OPEN") {
    return { error: "CLOSE_OPEN_PROJECT_ONLY" };
  }

  const contract = await prisma.contract.findUnique({
    where: { projectId },
    select: { id: true },
  });
  if (contract) {
    return { error: "CANNOT_CLOSE_WITH_FREELANCER" };
  }

  await prisma.$transaction([
    prisma.project.update({
      where: { id: projectId },
      data: { status: "CLOSED" },
    }),
    prisma.bid.updateMany({
      where: { projectId, status: "PENDING" },
      data: { status: "REJECTED" },
    }),
  ]);

  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/projects/my");
  revalidatePath("/client/projects");
  revalidatePath("/client");
  revalidatePath("/projects");
  revalidatePath("/dashboard/bids");
  revalidatePath("/notifications");
  return { success: true };
}
