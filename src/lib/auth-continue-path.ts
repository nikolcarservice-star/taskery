export function authContinuePath(callbackUrl = "/"): string {
  if (callbackUrl === "/") {
    return "/auth/continue";
  }

  const params = new URLSearchParams({ callbackUrl });
  return `/auth/continue?${params}`;
}
