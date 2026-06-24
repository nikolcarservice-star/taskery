"use client";

import { isBlobStorageUrl } from "@/lib/blob-url";

type MessageAttachmentProps = {
  url: string;
  filename: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
};

function attachmentHref(url: string): string {
  if (isBlobStorageUrl(url) || url.startsWith("/uploads/chat/")) {
    return `/api/blob?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function formatSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessageAttachment({
  url,
  filename,
  mimeType,
  sizeBytes,
}: MessageAttachmentProps) {
  const href = attachmentHref(url);
  const isImage = mimeType?.startsWith("image/");

  if (isImage) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-2 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={href}
          alt={filename}
          className="max-h-64 max-w-full rounded-lg border border-zinc-200 object-contain"
        />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
    >
      <span className="font-medium">{filename}</span>
      {sizeBytes ? (
        <span className="text-xs text-zinc-500">{formatSize(sizeBytes)}</span>
      ) : null}
    </a>
  );
}
