"use server";

import {
  clearAdminWorkMode,
  setAdminWorkMode,
  type AdminWorkMode,
} from "@/lib/admin-work-mode";
import { auth } from "@/lib/auth";

export async function chooseAdminWorkMode(mode: AdminWorkMode) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Доступ запрещён" } as const;
  }

  await setAdminWorkMode(mode);
  return { success: true } as const;
}

export async function resetAdminWorkMode() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Доступ запрещён" } as const;
  }

  await clearAdminWorkMode();
  return { success: true } as const;
}
