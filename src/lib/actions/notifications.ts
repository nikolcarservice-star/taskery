"use server";

import { auth } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import { localizedPath } from "@/lib/i18n/routing";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { revalidateInboxPaths } from "@/lib/revalidate-inbox";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { redirect } from "next/navigation";

export type NotificationActionState = {
  error?: string;
  success?: boolean;
};

export async function openNotificationAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/notifications");
  }

  const notificationId = (formData.get("notificationId") as string | null)?.trim();
  const locale = await getLocale();

  if (notificationId) {
    await markNotificationRead(session.user.id, notificationId);

    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId: session.user.id },
      select: { link: true },
    });

    revalidateInboxPaths();

    if (notification?.link) {
      redirect(
        localizedPath(
          locale,
          safeRedirectPath(notification.link, "/notifications"),
        ),
      );
    }
  }

  revalidateInboxPaths();
}

export async function markNotificationReadAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  const notificationId = (formData.get("notificationId") as string | null)?.trim();
  if (!notificationId) {
    return;
  }

  await markNotificationRead(session.user.id, notificationId);
  revalidateInboxPaths();
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  await markAllNotificationsRead(session.user.id);
  revalidateInboxPaths();
}
