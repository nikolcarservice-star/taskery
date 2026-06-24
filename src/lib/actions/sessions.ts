"use server";

import { actionError, ActionErrorCode } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SessionActionState = { error?: string; success?: boolean };

export async function logoutAllSessions(
  _prevState: SessionActionState,
): Promise<SessionActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError(ActionErrorCode.AUTH_REQUIRED);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { sessionVersion: { increment: 1 } },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/client/settings");
  return { success: true };
}
