"use client";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
  openNotificationAction,
} from "@/lib/actions/notifications";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { formatRelativeTime } from "@/lib/i18n/relative-time";
import { getNotificationDisplayText } from "@/lib/i18n/notification-display";
import type { NotificationItem } from "@/lib/notifications-shared";
import Link from "next/link";

type NotificationsListProps = {
  notifications: NotificationItem[];
  unreadCount: number;
  variant?: "client" | "freelancer";
};

function NotificationRow({
  item,
  typeLabels,
  timeLabels,
  dict,
}: {
  item: NotificationItem;
  typeLabels: Record<NotificationItem["type"], string>;
  timeLabels: ReturnType<typeof useDictionary>["time"];
  dict: ReturnType<typeof useDictionary>;
}) {
  const isUnread = !item.readAt;
  const display = getNotificationDisplayText(item, dict);

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isUnread
              ? "bg-indigo-100 text-indigo-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {typeLabels[item.type]}
        </span>
        {isUnread && (
          <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true" />
        )}
      </div>
      <p className="mt-2 font-semibold text-zinc-900">{display.title}</p>
      {display.body && (
        <p className="mt-1 text-sm leading-6 text-zinc-600">{display.body}</p>
      )}
      <p className="mt-2 text-xs text-zinc-500">
        {formatRelativeTime(item.createdAt, timeLabels)}
      </p>
    </>
  );

  if (item.link) {
    return (
      <li>
        <form action={openNotificationAction}>
          <input type="hidden" name="notificationId" value={item.id} />
          <button
            type="submit"
            className={`block w-full rounded-xl border p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 ${
              isUnread
                ? "border-indigo-200 bg-indigo-50/30"
                : "border-zinc-200 bg-white"
            }`}
          >
            {content}
          </button>
        </form>
      </li>
    );
  }

  return (
    <li>
      <form action={markNotificationReadAction}>
        <input type="hidden" name="notificationId" value={item.id} />
        <button
          type="submit"
          className={`block w-full rounded-xl border p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 ${
            isUnread
              ? "border-indigo-200 bg-indigo-50/30"
              : "border-zinc-200 bg-white"
          }`}
        >
          {content}
        </button>
      </form>
    </li>
  );
}

export function NotificationsList({
  notifications,
  unreadCount,
  variant = "freelancer",
}: NotificationsListProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const np = dict.notificationsPage;
  const isClient = variant === "client";

  if (notifications.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
        <p className="text-base font-medium text-zinc-900">{np.emptyTitle}</p>
        <p className="mt-2 text-sm text-zinc-600">
          {isClient ? np.emptyClient : np.emptyFreelancer}
        </p>
        <Link
          href={l(isClient ? "/client/projects" : "/dashboard/profile")}
          className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:underline"
        >
          {isClient ? np.goProjects : np.goProfile}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          {unreadCount > 0
            ? np.unreadCount.replace("{count}", String(unreadCount))
            : np.allRead}
        </p>
        {unreadCount > 0 && (
          <form action={markAllNotificationsReadAction}>
            <button
              type="submit"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              {np.markAllRead}
            </button>
          </form>
        )}
      </div>

      <ul className="space-y-3">
        {notifications.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            typeLabels={dict.labels.notificationType}
            timeLabels={dict.time}
            dict={dict}
          />
        ))}
      </ul>
    </div>
  );
}
