import { actionError, type ActionErrorCode } from "@/lib/action-errors";
import { ImageStorageError } from "@/lib/image-storage";

export function mapImageUploadError(error: unknown): { error: string } {
  if (error instanceof ImageStorageError) {
    return actionError(error.code as ActionErrorCode);
  }

  if (error instanceof Error) {
    if (/No token found|BLOB_READ_WRITE_TOKEN|BLOB_STORE_ID|OIDC/i.test(error.message)) {
      return actionError("IMAGE_STORAGE_NOT_CONFIGURED");
    }
    return { error: error.message };
  }

  return { error: "FILE_REQUIRED" };
}
