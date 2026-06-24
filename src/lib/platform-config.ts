import "server-only";

function envFlag(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") {
    return defaultValue;
  }

  return raw === "true" || raw === "1";
}

/** When false, new projects are created with status OPEN (no admin pre-approval). */
export const projectPreModerationEnabled = envFlag("PROJECT_PRE_MODERATION", true);

/** When false, portfolio items and avatars publish immediately without admin review. */
export const contentPreModerationEnabled = envFlag("CONTENT_PRE_MODERATION", true);
