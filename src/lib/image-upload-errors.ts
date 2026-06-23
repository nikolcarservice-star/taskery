import { actionError, type ActionErrorCode } from "@/lib/action-errors";
import { ImageStorageError } from "@/lib/image-storage";

export function mapImageUploadError(error: unknown): { error: string } {
  if (error instanceof ImageStorageError) {
    return actionError(error.code as ActionErrorCode);
  }

  if (error instanceof Error) {
    return { error: error.message };
  }

  return { error: "FILE_REQUIRED" };
}
