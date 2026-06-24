import webpush from "web-push";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

function pushConfigured(): boolean {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_PUBLIC_KEY.length > 0,
  );
}

function configureWebPush() {
  if (!pushConfigured()) return false;

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? `mailto:${siteConfig.emails.support}`,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  return true;
}

export function getVapidPublicKey(): string | null {
  const key = process.env.VAPID_PUBLIC_KEY?.trim();
  return key || null;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  if (!configureWebPush()) return;

  const [settings, subscriptions] = await Promise.all([
    prisma.userSettings.findUnique({
      where: { userId },
      select: { pushBrowser: true },
    }),
    prisma.pushSubscription.findMany({ where: { userId } }),
  ]);

  if (!settings?.pushBrowser || subscriptions.length === 0) return;

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/notifications",
  });

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          body,
        );
      } catch (error) {
        const statusCode =
          error && typeof error === "object" && "statusCode" in error
            ? Number(error.statusCode)
            : 0;

        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.deleteMany({
            where: { id: subscription.id },
          });
        } else {
          console.error("[push]", userId, error);
        }
      }
    }),
  );
}
