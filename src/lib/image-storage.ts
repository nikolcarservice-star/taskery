import { del, put } from "@vercel/blob";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function usesBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isLocalUploadUrl(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("/uploads/"));
}

export function isBlobStorageUrl(url: string | null | undefined): boolean {
  return Boolean(url?.includes(".blob.vercel-storage.com/"));
}

export function isManagedImageUrl(url: string | null | undefined): boolean {
  return isLocalUploadUrl(url) || isBlobStorageUrl(url);
}

export function validateImageFile(file: File): { ext: string } {
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    throw new Error("Допустимы только JPG, PNG и WebP");
  }

  if (file.size === 0) {
    throw new Error("Файл не выбран");
  }

  if (file.size > IMAGE_MAX_SIZE_BYTES) {
    throw new Error("Размер файла не более 5 МБ");
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
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
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
