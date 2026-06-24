import { auth } from "@/lib/auth";
import {
  ChatAttachmentError,
  uploadChatAttachment,
} from "@/lib/chat-attachment-storage";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "FILE_REQUIRED" }, { status: 400 });
    }

    const stored = await uploadChatAttachment(
      file,
      `messages/${session.user.id}`,
    );

    return NextResponse.json(stored);
  } catch (error) {
    if (error instanceof ChatAttachmentError) {
      return NextResponse.json({ error: error.code }, { status: 400 });
    }

    console.error("[messages/attachment]", error);
    return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 500 });
  }
}
