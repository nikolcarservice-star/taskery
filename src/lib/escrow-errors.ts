import type { ActionErrorCode } from "@/lib/action-errors";

export class EscrowError extends Error {
  readonly code: ActionErrorCode;

  constructor(code: ActionErrorCode) {
    super(code);
    this.name = "EscrowError";
    this.code = code;
  }
}

export function mapEscrowError(error: unknown): ActionErrorCode {
  if (error instanceof EscrowError) {
    return error.code;
  }
  return "ESCROW_OPERATION_FAILED";
}
