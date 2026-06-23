"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export type CatalogActionState = {
  error?: string;
  success?: boolean;
};

async function requireCatalogAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Доступ запрещён" } as const;
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return { error: "Аккаунт деактивирован" } as const;
  }

  if (!hasAdminPermission(admin.adminPermissions, "STAFF_MANAGE")) {
    return { error: "Недостаточно прав" } as const;
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
    return { error: "Укажите название категории" };
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
    return { error: "Укажите название навыка" };
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) return { error: "Категория не найдена" };
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
      return { error: "Навык с таким названием уже существует" };
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
