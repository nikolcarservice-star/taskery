"use server";

import { actionError, ActionErrorCode } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildTotpUri, generateTotpSecret, verifyTotpCode } from "@/lib/totp";
import { revalidatePath } from "next/cache";

export type TwoFactorActionState = {
  error?: string;
  success?: boolean;
  setupUri?: string;
  secret?: string;
};

function revalidateSecurityPaths() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/client/settings");
  revalidatePath("/dashboard/finances");
}

export async function verifyUserTotp(userId: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true, twoFactorSecret: true },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return true;
  }

  return verifyTotpCode(user.twoFactorSecret, code);
}

export async function startTwoFactorSetup(
  _prevState: TwoFactorActionState,
): Promise<TwoFactorActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError(ActionErrorCode.AUTH_REQUIRED);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, twoFactorEnabled: true },
  });

  if (!user) {
    return actionError(ActionErrorCode.USER_NOT_FOUND);
  }

  if (user.twoFactorEnabled) {
    return actionError(ActionErrorCode.TWO_FACTOR_ALREADY_ENABLED);
  }

  const secret = generateTotpSecret();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    },
  });

  revalidateSecurityPaths();

  return {
    success: true,
    setupUri: buildTotpUri(user.email, secret),
    secret,
  };
}

export async function confirmTwoFactorSetup(
  _prevState: TwoFactorActionState,
  formData: FormData,
): Promise<TwoFactorActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError(ActionErrorCode.AUTH_REQUIRED);
  }

  const code = (formData.get("code") as string | null)?.trim() ?? "";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true, twoFactorSecret: true },
  });

  if (!user?.twoFactorSecret) {
    return actionError(ActionErrorCode.TWO_FACTOR_SETUP_REQUIRED);
  }

  if (user.twoFactorEnabled) {
    return actionError(ActionErrorCode.TWO_FACTOR_ALREADY_ENABLED);
  }

  if (!verifyTotpCode(user.twoFactorSecret, code)) {
    return actionError(ActionErrorCode.TWO_FACTOR_INVALID);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: true },
  });

  revalidateSecurityPaths();
  return { success: true };
}

export async function disableTwoFactor(
  _prevState: TwoFactorActionState,
  formData: FormData,
): Promise<TwoFactorActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError(ActionErrorCode.AUTH_REQUIRED);
  }

  const code = (formData.get("code") as string | null)?.trim() ?? "";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true, twoFactorSecret: true },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return actionError(ActionErrorCode.TWO_FACTOR_NOT_ENABLED);
  }

  if (!verifyTotpCode(user.twoFactorSecret, code)) {
    return actionError(ActionErrorCode.TWO_FACTOR_INVALID);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  revalidateSecurityPaths();
  return { success: true };
}
