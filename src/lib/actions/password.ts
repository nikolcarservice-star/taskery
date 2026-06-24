"use server";

import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { getEmailLocaleForUser } from "@/lib/i18n/user-locale";
import { validatePassword } from "@/lib/password-policy";
import { checkRateLimit } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/seo";

export type ActionState = { error?: string; success?: boolean };

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  if (!email) return { error: "EMAIL_REQUIRED" };

  const limited = checkRateLimit(`password-reset:${email}`, 3, 60_000);
  if (!limited.ok) {
    return { success: true };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true, email: true, interfaceLanguage: true },
  });

  // Always show success to prevent email enumeration
  if (!user?.passwordHash) {
    return { success: true };
  }

  const token = nanoid(48);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  await sendPasswordResetEmail(
    user.email,
    absoluteUrl(`/reset-password?token=${token}`),
    await getEmailLocaleForUser(user.id),
  );

  return { success: true };
}

export async function resetPassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = (formData.get("token") as string | null)?.trim();
  const password = (formData.get("password") as string | null)?.trim() ?? "";

  const passwordError = validatePassword(password);
  if (!token || passwordError) {
    return { error: passwordError ?? "Некорректный запрос" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { error: "INVALID_RESET_LINK" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  return { success: true };
}
