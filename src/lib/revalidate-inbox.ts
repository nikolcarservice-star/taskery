import { revalidatePath } from "next/cache";

/** Invalidate header badges, mobile chrome, and inbox pages after read/send. */
export function revalidateInboxPaths() {
  revalidatePath("/notifications");
  revalidatePath("/messages", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/client", "layout");
}
