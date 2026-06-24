"use server";

import { actionError } from "@/lib/action-errors";
import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CmsActionState = { error?: string; success?: boolean };

const LOCALES = ["ru", "uk", "en", "pl"] as const;

async function requireCmsAdmin() {
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

export async function adminSaveCmsPage(
  _prevState: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  const authResult = await requireCmsAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const slug = (formData.get("slug") as string | null)?.trim();
  const locale = (formData.get("locale") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const body = (formData.get("body") as string | null)?.trim() ?? "";

  if (!slug || !title) {
    return actionError("CMS_SLUG_TITLE_REQUIRED");
  }

  if (!locale || !LOCALES.includes(locale as (typeof LOCALES)[number])) {
    return actionError("CMS_INVALID_LOCALE");
  }

  if (body.length < 10) {
    return actionError("CMS_CONTENT_TOO_SHORT");
  }

  const page = await prisma.cmsPage.upsert({
    where: { slug_locale: { slug, locale } },
    create: { slug, locale, title, body },
    update: { title, body },
  });

  await logAdminAction(authResult.admin.id, "CMS_PAGE_SAVE", {
    targetType: "cms_page",
    targetId: page.id,
    details: { slug, locale },
  });

  revalidatePath("/admin");
  revalidatePath(`/${locale}/pages/${slug}`);
  return { success: true };
}
