import { auth } from "@/lib/auth";
import { deleteUserAccount } from "@/lib/delete-user";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteUserAccount(session.user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
