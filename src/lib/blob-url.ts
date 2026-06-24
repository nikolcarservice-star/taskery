import { isSafeHttpUrl } from "@/lib/safe-url";

/** Public avatar/portfolio URLs served from Vercel Blob. */
export function isBlobStorageUrl(url: string | null | undefined): boolean {
  return Boolean(url?.includes(".blob.vercel-storage.com/"));
}

export function isPrivateBlobUrl(url: string | null | undefined): boolean {
  return Boolean(url?.includes(".private.blob.vercel-storage.com/"));
}

export function resolveBlobAssetUrl(url: string): string {
  if (isPrivateBlobUrl(url)) {
    return `/api/blob?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/** Site uploads, public/private Blob, or safe external image URL for <img src>. */
export function resolveAssetDisplayUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  if (trimmed.startsWith("blob:")) return trimmed;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed.includes("\\") || trimmed.includes("\0") ? null : trimmed;
  }

  if (isBlobStorageUrl(trimmed)) {
    return resolveBlobAssetUrl(trimmed);
  }

  return isSafeHttpUrl(trimmed) ? trimmed : null;
}
