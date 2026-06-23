import {
  deleteStoredImage,
  isLocalUploadUrl,
  isManagedImageUrl,
  uploadImage,
} from "@/lib/image-storage";

/** @deprecated Use isManagedImageUrl or isLocalUploadUrl from image-storage. */
export function isLocalAvatarUrl(avatarUrl: string | null | undefined): boolean {
  return isLocalUploadUrl(avatarUrl);
}

export async function deleteLocalAvatar(avatarUrl: string | null | undefined) {
  await deleteStoredImage(avatarUrl);
}

export { isManagedImageUrl };

export async function saveUserAvatar(userId: string, file: File): Promise<string> {
  return uploadImage(file, `avatars/${userId}`);
}
