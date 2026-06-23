"use server";

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
    return { error: "Доступ запрещён" };
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!actor?.adminActive) {
    return { error: "Аккаунт деактивирован" };
  }

  if (!hasAdminPermission(actor.adminPermissions, "STAFF_MANAGE")) {
    return { error: "Недостаточно прав для управления админами" };
  }

  return { actor };
}

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Пароль должен быть не короче 8 символов";
  }
  return null;
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
    return { error: "Укажите корректный email" };
  }

  if (!name) {
    return { error: "Укажите имя администратора" };
  }

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  if (permissions.length === 0) {
    return { error: "Выберите хотя бы одну функцию" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Пользователь с таким email уже существует" };
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

  if (!adminId) return { error: "Администратор не найден" };
  if (!name) return { error: "Укажите имя администратора" };
  if (permissions.length === 0) {
    return { error: "Выберите хотя бы одну функцию" };
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
    return { error: "Администратор не найден" };
  }

  const targetWasSuper = isSuperAdmin(target.adminPermissions);
  const targetWillBeSuper = isSuperAdmin(permissions);

  if (adminId === authResult.actor.id && !adminActive) {
    return { error: "Нельзя деактивировать свой аккаунт" };
  }

  if (adminId === authResult.actor.id && !targetWillBeSuper) {
    return { error: "Нельзя снять с себя полный доступ" };
  }

  if (targetWasSuper && (!targetWillBeSuper || !adminActive)) {
    const remaining = await countActiveSuperAdmins(adminId);
    if (remaining === 0) {
      return {
        error: "Нельзя оставить систему без активного супер-админа",
      };
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
    if (passwordError) return { error: passwordError };
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
  if (!adminId) return { error: "Администратор не найден" };

  if (adminId === authResult.actor.id) {
    return { error: "Нельзя деактивировать свой аккаунт" };
  }

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, adminPermissions: true, adminActive: true },
  });

  if (!target || target.role !== "ADMIN") {
    return { error: "Администратор не найден" };
  }

  if (target.adminActive && isSuperAdmin(target.adminPermissions)) {
    const remaining = await countActiveSuperAdmins(adminId);
    if (remaining === 0) {
      return {
        error: "Нельзя деактивировать последнего супер-админа",
      };
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
  if (!adminId) return { error: "Администратор не найден" };

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, adminActive: true },
  });

  if (!target || target.role !== "ADMIN") {
    return { error: "Администратор не найден" };
  }

  if (target.adminActive) {
    return { error: "Администратор уже активен" };
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
  if (!adminId) return { error: "Администратор не найден" };

  if (adminId === authResult.actor.id) {
    return { error: "Нельзя удалить свой аккаунт" };
  }

  const target = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, adminActive: true },
  });

  if (!target || target.role !== "ADMIN") {
    return { error: "Администратор не найден" };
  }

  if (target.adminActive) {
    return { error: "Сначала деактивируйте администратора" };
  }

  await deleteUserAccount(adminId);

  revalidatePath("/admin");
  return { success: true };
}
