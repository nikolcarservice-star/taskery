"use server";

import { auth } from "@/lib/auth";
import { THEME_OPTIONS } from "@/lib/settings-shared";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

const THEMES = new Set(THEME_OPTIONS.map((item) => item.value));

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export async function updateServiceSettings(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "AUTH_REQUIRED" };

  const theme = (formData.get("theme") as string | null)?.trim();

  if (!theme || !THEMES.has(theme as typeof THEME_OPTIONS[number]["value"])) {
    return { error: "THEME_REQUIRED" };
  }

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      emailProjectDigest: checkbox(formData, "emailProjectDigest"),
      emailNewMessages: checkbox(formData, "emailNewMessages"),
      emailServiceInfo: checkbox(formData, "emailServiceInfo"),
      emailPromotions: checkbox(formData, "emailPromotions"),
      emailNews: checkbox(formData, "emailNews"),
      emailBlogDigest: checkbox(formData, "emailBlogDigest"),
      pushBrowser: checkbox(formData, "pushBrowser"),
      soundNewMessages: checkbox(formData, "soundNewMessages"),
      theme,
    },
    update: {
      emailProjectDigest: checkbox(formData, "emailProjectDigest"),
      emailNewMessages: checkbox(formData, "emailNewMessages"),
      emailServiceInfo: checkbox(formData, "emailServiceInfo"),
      emailPromotions: checkbox(formData, "emailPromotions"),
      emailNews: checkbox(formData, "emailNews"),
      emailBlogDigest: checkbox(formData, "emailBlogDigest"),
      pushBrowser: checkbox(formData, "pushBrowser"),
      soundNewMessages: checkbox(formData, "soundNewMessages"),
      theme,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/client/settings");
  return { success: true };
}
