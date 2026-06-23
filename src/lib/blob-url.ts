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
