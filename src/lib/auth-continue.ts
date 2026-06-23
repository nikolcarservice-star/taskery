export function buildAuthContinueUrl(callbackUrl = "/") {
  const safe =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";
  const url = new URL("/auth/continue", window.location.origin);
  if (safe !== "/") {
    url.searchParams.set("callbackUrl", safe);
  }
  return `${url.pathname}${url.search}`;
}
