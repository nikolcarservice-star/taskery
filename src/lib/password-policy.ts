import type { ActionErrorCode } from "@/lib/action-errors";

const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(password: string): ActionErrorCode | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "PASSWORD_TOO_SHORT";
  }
  return null;
}

export { MIN_PASSWORD_LENGTH };
