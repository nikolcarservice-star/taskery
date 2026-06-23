/** Resolves Auth.js secret from env (supports legacy NEXTAUTH_SECRET). */
export function getAuthSecret(): string | undefined {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const trimmed = secret?.trim();
  return trimmed?.length ? trimmed : undefined;
}

export function isAuthConfigured(): boolean {
  return Boolean(getAuthSecret());
}
