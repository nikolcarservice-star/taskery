import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getInboxChromeData } from "@/lib/inbox-chrome";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getInboxChromeData(session.user.id);
  return NextResponse.json(data);
}
