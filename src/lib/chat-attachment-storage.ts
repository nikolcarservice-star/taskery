import { put } from "@vercel/blob";
import { isBlobStorageUrl } from "@/lib/blob-url";
import { usesBlobStorage, canUseLocalImageStorage } from "@/lib/image-storage";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const CHAT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export class ChatAttachmentError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = "ChatAttachmentError";
    this.code = code;
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-()+\s]/g, "_").slice(0, 120) || "file";
}

export function validateChatAttachment(file: File): {
  mimeType: string;
  filename: string;
} {
  if (file.size === 0) {
    throw new ChatAttachmentError("FILE_REQUIRED");
  }

  if (file.size > CHAT_ATTACHMENT_MAX_BYTES) {
    throw new ChatAttachmentError("FILE_TOO_LARGE");
  }

  const mimeType = file.type || "application/octet-stream";
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new ChatAttachmentError("ATTACHMENT_INVALID_TYPE");
  }

  return {
    mimeType,
    filename: sanitizeFilename(file.name || "attachment"),
  };
}

export async function uploadChatAttachment(
  file: File,
  storagePath: string,
): Promise<{ url: string; filename: string; mimeType: string; sizeBytes: number }> {
  const { mimeType, filename } = validateChatAttachment(file);

  if (usesBlobStorage()) {
    const blob = await put(storagePath, file, {
      access: "private",
      addRandomSuffix: true,
      contentType: mimeType,
    });

    return {
      url: blob.url,
      filename,
      mimeType,
      sizeBytes: file.size,
    };
  }

  if (!canUseLocalImageStorage()) {
    throw new ChatAttachmentError("IMAGE_STORAGE_NOT_CONFIGURED");
  }

  const ext = path.extname(filename) || "";
  const publicPath = `/uploads/chat/${storagePath}${ext}`;
  const fullPath = path.join(process.cwd(), "public", publicPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, Buffer.from(await file.arrayBuffer()));

  return {
    url: publicPath,
    filename,
    mimeType,
    sizeBytes: file.size,
  };
}

export function isPrivateChatAttachmentUrl(url: string): boolean {
  return isBlobStorageUrl(url) || url.startsWith("/uploads/chat/");
}
