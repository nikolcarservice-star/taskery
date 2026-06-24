import { revalidatePath } from "next/cache";

export const ADMIN_PANEL_PATHS = [
  "/admin/overview",
  "/admin/moderation",
  "/admin/users",
  "/admin/finance",
  "/admin/platform",
  "/admin/team",
] as const;

export function revalidateAdminPanelPaths() {
  for (const path of ADMIN_PANEL_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/admin/mobile");
  revalidatePath("/admin/mobile/moderation");
  revalidatePath("/admin/mobile/users");
  revalidatePath("/admin/mobile/finance");
  revalidatePath("/admin/mobile/verification");
  revalidatePath("/admin/mobile/withdrawals");
  revalidatePath("/admin/mobile/support");
  revalidatePath("/admin/mobile/catalog");
  revalidatePath("/admin/mobile/staff");
  revalidatePath("/admin/mobile/broadcast");
}
