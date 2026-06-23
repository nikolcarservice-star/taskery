import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isLocalAvatarUrl(avatarUrl: string | null | undefined): boolean {
  return Boolean(avatarUrl?.startsWith("/uploads/avatars/"));
}

export async function deleteLocalAvatar(avatarUrl: string | null | undefined) {
  if (!isLocalAvatarUrl(avatarUrl)) {
    return;
  }

  try {
    await unlink(path.join(process.cwd(), "public", avatarUrl!));
  } catch {
    // File may already be removed.
  }
}

export async function saveUserAvatar(userId: string, file: File): Promise<string> {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error(
      "Загрузка аватаров недоступна: настройте внешнее хранилище (S3, Cloudinary и т.д.)",
    );
  }
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    throw new Error("Допустимы только JPG, PNG и WebP");
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Размер файла не более 5 МБ");
  }

  await mkdir(AVATAR_DIR, { recursive: true });

  const filename = `${userId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(AVATAR_DIR, filename), buffer);

  return `/uploads/avatars/${filename}`;
}
