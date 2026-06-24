export const INBOX_REFRESH_EVENT = "taskery:inbox-refresh";

export function requestInboxRefresh() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(INBOX_REFRESH_EVENT));
}
