import { authContinuePath } from "@/lib/auth-continue-path";

export function buildAuthContinueUrl(callbackUrl = "/") {
  return authContinuePath(callbackUrl);
}
