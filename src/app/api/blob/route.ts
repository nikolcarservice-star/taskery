import { isPrivateBlobUrl } from "@/lib/blob-url";
import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")?.trim();

  if (!url || !isPrivateBlobUrl(url)) {
    return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });
  }

  try {
    const result = await get(url, { access: "private" });

    if (!result) {
      return NextResponse.json({ error: "Blob not found" }, { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type":
          result.blob.contentType ??
          result.headers.get("content-type") ??
          "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Blob not found" }, { status: 404 });
  }
}
