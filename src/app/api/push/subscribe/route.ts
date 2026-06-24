import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SubscribeBody = {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SubscribeBody;
  const endpoint = body.endpoint?.trim();
  const p256dh = body.keys?.p256dh?.trim();
  const authKey = body.keys?.auth?.trim();

  if (!endpoint || !p256dh || !authKey) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: {
      userId_endpoint: {
        userId: session.user.id,
        endpoint,
      },
    },
    create: {
      userId: session.user.id,
      endpoint,
      p256dh,
      auth: authKey,
    },
    update: { p256dh, auth: authKey },
  });

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, pushBrowser: true },
    update: { pushBrowser: true },
  });

  return NextResponse.json({ ok: true });
}
