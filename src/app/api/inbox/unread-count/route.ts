import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getUnreadInboxMessageCount } from "@/lib/messages-inbox";
import { getUnreadNotificationCount } from "@/lib/notifications";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [messages, notifications] = await Promise.all([
    getUnreadInboxMessageCount(session.user.id),
    getUnreadNotificationCount(session.user.id),
  ]);

  return NextResponse.json({
    count: messages,
    messages,
    notifications,
  });
}
