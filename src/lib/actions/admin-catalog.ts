"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import {
  isSupportedCurrency,
  SUPPORTED_CURRENCIES,
} from "@/lib/i18n/currencies";
import { revalidatePath } from "next/cache";

export type CatalogActionState = {
  error?: string;
  success?: boolean;
};

async function requireCatalogAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return actionError("ADMIN_ACCOUNT_DEACTIVATED");
  }

  if (!hasAdminPermission(admin.adminPermissions, "STAFF_MANAGE")) {
    return actionError("ADMIN_INSUFFICIENT_PERMISSION");
  }

  return { admin } as const;
}

async function uniqueCategorySlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "category";
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.category.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    suffix += 1;
  }
}

async function uniqueSkillSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "skill";
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.skill.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    suffix += 1;
  }
}

export async function adminSaveCategory(
  _prevState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const authResult = await requireCatalogAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const categoryId = (formData.get("categoryId") as string | null)?.trim();
  const name = (formData.get("name") as string | null)?.trim();
  const description =
    (formData.get("description") as string | null)?.trim() || null;

  if (!name || name.length < 2) {
    return actionError("CATEGORY_NAME_REQUIRED");
  }

  if (categoryId) {
    const slug = await uniqueCategorySlug(name, categoryId);
    await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, description },
    });
    await logAdminAction(authResult.admin.id, "CATALOG_CATEGORY_SAVE", {
      targetType: "category",
      targetId: categoryId,
      details: { name, update: true },
    });
  } else {
    const slug = await uniqueCategorySlug(name);
    const created = await prisma.category.create({
      data: { name, slug, description },
    });
    await logAdminAction(authResult.admin.id, "CATALOG_CATEGORY_SAVE", {
      targetType: "category",
      targetId: created.id,
      details: { name, create: true },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/catalog");
  revalidatePath("/projects");
  return { success: true };
}

export async function adminSaveSkill(
  _prevState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const authResult = await requireCatalogAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const skillId = (formData.get("skillId") as string | null)?.trim();
  const name = (formData.get("name") as string | null)?.trim();
  const categoryId = (formData.get("categoryId") as string | null)?.trim() || null;

  if (!name || name.length < 2) {
    return actionError("SKILL_NAME_REQUIRED");
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) return actionError("CATEGORY_NOT_FOUND");
  }

  if (skillId) {
    const slug = await uniqueSkillSlug(name, skillId);
    await prisma.skill.update({
      where: { id: skillId },
      data: {
        name,
        slug,
        categoryId,
      },
    });
    await logAdminAction(authResult.admin.id, "CATALOG_SKILL_SAVE", {
      targetType: "skill",
      targetId: skillId,
      details: { name, update: true },
    });
  } else {
    const existingByName = await prisma.skill.findUnique({
      where: { name },
      select: { id: true },
    });
    if (existingByName) {
      return actionError("SKILL_DUPLICATE");
    }

    const slug = await uniqueSkillSlug(name);
    const created = await prisma.skill.create({
      data: { name, slug, categoryId },
    });
    await logAdminAction(authResult.admin.id, "CATALOG_SKILL_SAVE", {
      targetType: "skill",
      targetId: created.id,
      details: { name, create: true },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/catalog");
  revalidatePath("/freelancers");
  return { success: true };
}

export async function adminSaveCategoryMinBudget(
  _prevState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const authResult = await requireCatalogAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const categoryId = (formData.get("categoryId") as string | null)?.trim();
  const currency = (formData.get("currency") as string | null)?.trim();
  const minAmountRaw = (formData.get("minAmount") as string | null)?.trim();

  if (!categoryId) return actionError("CATEGORY_NOT_FOUND");
  if (!currency || !isSupportedCurrency(currency)) {
    return actionError("INVALID_CURRENCY");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) return actionError("CATEGORY_NOT_FOUND");

  if (!minAmountRaw) {
    await prisma.categoryMinBudget.deleteMany({
      where: { categoryId, currency },
    });
  } else {
    const minAmount = Number(minAmountRaw.replace(",", "."));
    if (!Number.isFinite(minAmount) || minAmount <= 0) {
      return actionError("MIN_BUDGET_POSITIVE_REQUIRED");
    }

    await prisma.categoryMinBudget.upsert({
      where: { categoryId_currency: { categoryId, currency } },
      create: { categoryId, currency, minAmount },
      update: { minAmount },
    });
  }

  await logAdminAction(authResult.admin.id, "CATALOG_CATEGORY_SAVE", {
    targetType: "category",
    targetId: categoryId,
    details: { currency, minAmount: minAmountRaw || null, minBudget: true },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/catalog");
  revalidatePath("/projects");
  return { success: true };
}

export async function adminDeleteCategory(
  _prevState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const authResult = await requireCatalogAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const categoryId = (formData.get("categoryId") as string | null)?.trim();
  if (!categoryId) return actionError("CATEGORY_NOT_FOUND");

  const projectsCount = await prisma.project.count({
    where: { categoryId },
  });
  if (projectsCount > 0) {
    return actionError("CATEGORY_HAS_PROJECTS");
  }

  await prisma.categoryMinBudget.deleteMany({ where: { categoryId } });
  await prisma.category.delete({ where: { id: categoryId } });

  await logAdminAction(authResult.admin.id, "CATALOG_CATEGORY_DELETE", {
    targetType: "category",
    targetId: categoryId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/catalog");
  return { success: true };
}

export async function adminDeleteSkill(
  _prevState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const authResult = await requireCatalogAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const skillId = (formData.get("skillId") as string | null)?.trim();
  if (!skillId) return actionError("SKILL_NOT_FOUND");

  await prisma.skill.delete({ where: { id: skillId } });

  await logAdminAction(authResult.admin.id, "CATALOG_SKILL_DELETE", {
    targetType: "skill",
    targetId: skillId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/catalog");
  return { success: true };
}
