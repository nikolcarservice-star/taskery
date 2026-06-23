"use server";



import { auth } from "@/lib/auth";

import {

  markAllNotificationsRead,

  markNotificationRead,

} from "@/lib/notifications";

import { prisma } from "@/lib/prisma";

import { safeRedirectPath } from "@/lib/safe-redirect";

import { revalidatePath } from "next/cache";

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



  if (notificationId) {

    await markNotificationRead(session.user.id, notificationId);



    const notification = await prisma.notification.findFirst({

      where: { id: notificationId, userId: session.user.id },

      select: { link: true },

    });



    revalidatePath("/notifications");



    if (notification?.link) {

      redirect(safeRedirectPath(notification.link, "/notifications"));

    }

  }



  revalidatePath("/notifications");

}



export async function markNotificationReadAction(

  _prev: NotificationActionState,

  formData: FormData,

): Promise<NotificationActionState> {

  const session = await auth();

  if (!session?.user?.id) {

    return { error: "AUTH_REQUIRED" };

  }



  const notificationId = (formData.get("notificationId") as string | null)?.trim();

  if (!notificationId) {

    return { error: "NOTIFICATION_NOT_FOUND" };

  }



  await markNotificationRead(session.user.id, notificationId);

  revalidatePath("/notifications");

  return { success: true };

}



export async function markAllNotificationsReadAction(): Promise<void> {

  const session = await auth();

  if (!session?.user?.id) {

    return;

  }



  await markAllNotificationsRead(session.user.id);

  revalidatePath("/notifications");

}


