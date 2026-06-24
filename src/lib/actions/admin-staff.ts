"use server";

import { actionError } from "@/lib/action-errors";
import type { AdminPermission } from "@/generated/prisma/client";
import {
  hasAdminPermission,
  isSuperAdmin,
  parseAdminPermissions,
} from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { deleteUserAccount } from "@/lib/delete-user";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { validatePassword } from "@/lib/password-policy";

export type StaffActionState = {
  error?: string;
  success?: boolean;
};

type AdminActor = {
  id: string;
  adminPermissions: AdminPermission[];
};

async function requireStaffManager(): Promise<
  { actor: AdminActor } | { error: string }
> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return actionError("ACCESS_DENIED");
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!actor?.adminActive) {
    return actionError("ADMIN_ACCOUNT_DEACTIVATED");
  }

  if (!hasAdminPermission(actor.adminPermissions, "STAFF_MANAGE")) {
    return actionError("ADMIN_STAFF_MANAGE_REQUIRED");
  }

  return { actor };
}

async function countActiveSuperAdmins(excludeId?: string): Promise<number> {
  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
      adminActive: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { adminPermissions: true },
  });

  return admins.filter((admin) => isSuperAdmin(admin.adminPermissions)).length;
}

export async function createAdminStaff(
  _prevState: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authResult = await requireStaffManager();
  if ("error" in authResult) return { error: authResult.error };

  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const name = (formData.get("name") as string | null)?.trim();
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const permissions = parseAdminPermissions(
    formData.getAll("permissions"),
  );

  if (!email || !email.includes("@")) {
    return actionError("ADMIN_EMAIL_INVALID");
  }

  if (!name) {
    return actionError("ADMIN_NAME_REQUIRED");
  }

  const passwordError = validatePassword(password);
  if (passwordError) return actionError(passwordError);

  if (permissions.length === 0) {
    return actionError("ADMIN_PERMISSIONS_REQUIRED");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return actionError("ADMIN_EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      adminPermissions: permissions,
      adminActive: true,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function updateAdminStaff(
  _prevState: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authResult = await requireStaffManager();
  if ("error" in authResult) return { error: authResult.error };

  const adminId = (formData.get("adminId") as string | null)?.trim();
  const name = (formData.get("name") as string | null)?.trim();
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const adminActive = formData.get("adminActive") === "true";
  const permissions = parseAdminPermissions(
    formData.getAll("permissions"),
  );

  if (!adminId) return actionError("ADMIN_NOT_FOUND");
  if (!name) return actionError("ADMIN_NAME_REQUIRED");
  if (permissions.length === 0) {
    return actionError("ADMIN_PERMISSIONS_REQUIRED");
  }

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      role: true,
      adminPermissions: true,
      adminActive: true,
    },
  });

  if (!target || target.role !== "ADMIN") {
    return actionError("ADMIN_NOT_FOUND");
  }

  const targetWasSuper = isSuperAdmin(target.adminPermissions);
  const targetWillBeSuper = isSuperAdmin(permissions);

  if (adminId === authResult.actor.id && !adminActive) {
    return actionError("ADMIN_CANNOT_DEACTIVATE_SELF");
  }

  if (adminId === authResult.actor.id && !targetWillBeSuper) {
    return actionError("ADMIN_CANNOT_REVOKE_OWN_ACCESS");
  }

  if (targetWasSuper && (!targetWillBeSuper || !adminActive)) {
    const remaining = await countActiveSuperAdmins(adminId);
    if (remaining === 0) {
      return actionError("ADMIN_LAST_SUPERADMIN_REQUIRED");
    }
  }

  const data: {
    name: string;
    adminPermissions: AdminPermission[];
    adminActive: boolean;
    passwordHash?: string;
  } = {
    name,
    adminPermissions: permissions,
    adminActive,
  };

  if (password) {
    const passwordError = validatePassword(password);
    if (passwordError) return actionError(passwordError);
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  await prisma.user.update({
    where: { id: adminId },
    data,
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deactivateAdminStaff(
  _prevState: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authResult = await requireStaffManager();
  if ("error" in authResult) return { error: authResult.error };

  const adminId = (formData.get("adminId") as string | null)?.trim();
  if (!adminId) return actionError("ADMIN_NOT_FOUND");

  if (adminId === authResult.actor.id) {
    return actionError("ADMIN_CANNOT_DEACTIVATE_SELF");
  }

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, adminPermissions: true, adminActive: true },
  });

  if (!target || target.role !== "ADMIN") {
    return actionError("ADMIN_NOT_FOUND");
  }

  if (target.adminActive && isSuperAdmin(target.adminPermissions)) {
    const remaining = await countActiveSuperAdmins(adminId);
    if (remaining === 0) {
      return actionError("ADMIN_LAST_SUPERADMIN_REQUIRED");
    }
  }

  await prisma.user.update({
    where: { id: adminId },
    data: { adminActive: false },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function reactivateAdminStaff(
  _prevState: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authResult = await requireStaffManager();
  if ("error" in authResult) return { error: authResult.error };

  const adminId = (formData.get("adminId") as string | null)?.trim();
  if (!adminId) return actionError("ADMIN_NOT_FOUND");

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, adminActive: true },
  });

  if (!target || target.role !== "ADMIN") {
    return actionError("ADMIN_NOT_FOUND");
  }

  if (target.adminActive) {
    return actionError("ADMIN_ALREADY_ACTIVE");
  }

  await prisma.user.update({
    where: { id: adminId },
    data: { adminActive: true },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteAdminStaff(
  _prevState: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authResult = await requireStaffManager();
  if ("error" in authResult) return { error: authResult.error };

  const adminId = (formData.get("adminId") as string | null)?.trim();
  if (!adminId) return actionError("ADMIN_NOT_FOUND");

  if (adminId === authResult.actor.id) {
    return actionError("ADMIN_CANNOT_DELETE_SELF");
  }

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, adminActive: true },
  });

  if (!target || target.role !== "ADMIN") {
    return actionError("ADMIN_NOT_FOUND");
  }

  if (target.adminActive) {
    return actionError("ADMIN_DEACTIVATE_BEFORE_DELETE");
  }

  await deleteUserAccount(adminId);

  revalidatePath("/admin");
  return { success: true };
}
