import type { Role } from "@/generated/prisma/client";
import {
  ADMIN_WORK_MODE_COOKIE,
  adminWorkModeCookieOptions,
  type AdminWorkMode,
} from "@/lib/admin-work-mode.constants";
import { cookies } from "next/headers";

export type { AdminWorkMode } from "@/lib/admin-work-mode.constants";
export {
  ADMIN_WORK_MODE_COOKIE,
  shouldSetAdminClientMode,
  shouldSetAdminFreelancerMode,
} from "@/lib/admin-work-mode.constants";

export async function getAdminWorkMode(): Promise<AdminWorkMode | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_WORK_MODE_COOKIE)?.value;

  if (value === "client" || value === "freelancer") {
    return value;
  }

  return null;
}

export async function isAdminInFreelancerMode(role?: Role | null) {
  if (role !== "ADMIN") {
    return false;
  }

  const mode = await getAdminWorkMode();
  return mode === "freelancer";
}

export async function isAdminInClientMode(role?: Role | null) {
  if (role !== "ADMIN") {
    return false;
  }

  const mode = await getAdminWorkMode();
  return mode !== "freelancer";
}

export async function setAdminWorkMode(mode: AdminWorkMode) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_WORK_MODE_COOKIE, mode, adminWorkModeCookieOptions);
}

export async function clearAdminWorkMode() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_WORK_MODE_COOKIE);
}
