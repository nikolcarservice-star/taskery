import type { Dictionary } from "@/lib/i18n/types";
import type { NotificationItem } from "@/lib/notifications-shared";

export function getNotificationDisplayText(
  item: NotificationItem,
  dict: Dictionary,
): { title: string; body: string | null } {
  const template = dict.notificationTemplates[item.type];
  if (!template) {
    return { title: item.title, body: item.body };
  }

  const title = template.title;
  if (!item.body) {
    return { title, body: null };
  }

  const separator = " · ";
  const splitIndex = item.body.indexOf(separator);
  if (splitIndex === -1) {
    return {
      title,
      body: template.body
        .replace("{name}", "")
        .replace("{project}", item.body)
        .replace(/^\s*·\s*/, "")
        .trim(),
    };
  }

  const name = item.body.slice(0, splitIndex).trim();
  const project = item.body.slice(splitIndex + separator.length).trim();

  return {
    title,
    body: template.body
      .replace("{name}", name)
      .replace("{project}", project),
  };
}
