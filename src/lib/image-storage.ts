import { del, put } from "@vercel/blob";
import { isBlobStorageUrl as isBlobUrl } from "@/lib/blob-url";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const EXT_FROM_NAME = /\.(jpe?g|png|webp)$/i;

function inferImageExt(file: File): string | null {
  const fromMime = MIME_TO_EXT[file.type];
  if (fromMime) return fromMime;

  const match = file.name.match(EXT_FROM_NAME);
  if (!match) return null;

  const raw = match[1].toLowerCase();
  return raw === "jpeg" ? "jpg" : raw;
}

export function usesBlobStorage(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return true;
  }

  // New Vercel Blob stores use OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN) on deploy.
  if (process.env.VERCEL === "1" && process.env.BLOB_STORE_ID?.trim()) {
    return true;
  }

  return false;
}

export function canUseLocalImageStorage(): boolean {
  if (usesBlobStorage()) return false;
  if (process.env.VERCEL === "1") return false;
  return true;
}

export class ImageStorageError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = "ImageStorageError";
    this.code = code;
  }
}

export function isLocalUploadUrl(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("/uploads/"));
}

export function isBlobStorageUrl(url: string | null | undefined): boolean {
  return isBlobUrl(url);
}

export function isManagedImageUrl(url: string | null | undefined): boolean {
  return isLocalUploadUrl(url) || isBlobStorageUrl(url);
}

export function validateImageFile(file: File): { ext: string } {
  const ext = inferImageExt(file);
  if (!ext) {
    throw new ImageStorageError("IMAGE_INVALID_TYPE");
  }

  if (file.size === 0) {
    throw new ImageStorageError("FILE_REQUIRED");
  }

  if (file.size > IMAGE_MAX_SIZE_BYTES) {
    throw new ImageStorageError("FILE_TOO_LARGE");
  }

  return { ext };
}

function localPublicPath(storagePath: string, ext: string): string {
  const pathname = storagePath.endsWith(`.${ext}`)
    ? storagePath
    : `${storagePath}.${ext}`;
  return pathname.startsWith("/uploads/")
    ? pathname
    : `/uploads/${pathname}`;
}

export async function uploadImage(file: File, storagePath: string): Promise<string> {
  const { ext } = validateImageFile(file);

  if (usesBlobStorage()) {
    const pathname = storagePath.endsWith(`.${ext}`)
      ? storagePath
      : `${storagePath}.${ext}`;

    try {
      const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return blob.url;
    } catch (error) {
      if (
        error instanceof Error &&
        /private|access/i.test(error.message)
      ) {
        const blob = await put(pathname, file, {
          access: "private",
          addRandomSuffix: false,
        });
        return blob.url;
      }
      throw error;
    }
  }

  if (!canUseLocalImageStorage()) {
    throw new ImageStorageError("IMAGE_STORAGE_NOT_CONFIGURED");
  }

  const publicPath = localPublicPath(storagePath, ext);
  const fullPath = path.join(process.cwd(), "public", publicPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, Buffer.from(await file.arrayBuffer()));
  return publicPath;
}

export async function deleteStoredImage(url: string | null | undefined) {
  if (!url) {
    return;
  }

  if (isBlobStorageUrl(url)) {
    try {
      await del(url);
    } catch {
      // File may already be removed.
    }
    return;
  }

  if (isLocalUploadUrl(url)) {
    try {
      await unlink(path.join(process.cwd(), "public", url));
    } catch {
      // File may already be removed.
    }
  }
}
