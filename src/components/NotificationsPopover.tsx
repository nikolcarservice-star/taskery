"use client";

import { openNotificationAction } from "@/lib/actions/notifications";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { getNotificationDisplayText } from "@/lib/i18n/notification-display";
import { formatRelativeTime, unreadShort } from "@/lib/i18n/relative-time";
import type { NotificationItem } from "@/lib/notifications-shared";
import Link from "next/link";

type NotificationsPopoverProps = {
  notifications: NotificationItem[];
  unreadCount: number;
  variant?: "client" | "freelancer";
};

export function NotificationsPopover({
  notifications,
  unreadCount,
  variant = "freelancer",
}: NotificationsPopoverProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const p = dict.popovers.notifications;
  const isClient = variant === "client";

  return (
    <div
      role="dialog"
      aria-label={p.title}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
    >
      <div className="border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-zinc-900">{p.title}</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              {unreadShort(unreadCount, dict.popovers.unreadShort)}
            </span>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm font-medium text-zinc-900">{p.emptyTitle}</p>
          <p className="mt-1.5 text-sm leading-6 text-zinc-600">
            {isClient ? p.emptyClient : p.emptyFreelancer}
          </p>
        </div>
      ) : (
        <ul className="max-h-[320px] overflow-y-auto">
          {notifications.map((item) => {
            const isUnread = !item.readAt;

            if (item.link) {
              return (
                <li key={item.id} className="border-b border-zinc-50 last:border-0">
                  <form action={openNotificationAction}>
                    <input type="hidden" name="notificationId" value={item.id} />
                    <button
                      type="submit"
                      className={`block w-full px-4 py-3 text-left transition-colors hover:bg-indigo-50/50 ${
                        isUnread ? "bg-indigo-50/30" : "bg-white"
                      }`}
                    >
                      <NotificationRowContent item={item} isUnread={isUnread} />
                    </button>
                  </form>
                </li>
              );
            }

            return (
              <li
                key={item.id}
                className={`border-b border-zinc-50 px-4 py-3 last:border-0 ${
                  isUnread ? "bg-indigo-50/30" : "bg-white"
                }`}
              >
                <NotificationRowContent item={item} isUnread={isUnread} />
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <Link
          href={l("/notifications")}
          className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          {p.viewAll}
        </Link>
      </div>
    </div>
  );
}

function NotificationRowContent({
  item,
  isUnread,
}: {
  item: NotificationItem;
  isUnread: boolean;
}) {
  const dict = useDictionary();
  const typeLabels = dict.labels.notificationType;
  const display = getNotificationDisplayText(item, dict);

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isUnread
              ? "bg-indigo-100 text-indigo-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {typeLabels[item.type]}
        </span>
        {isUnread && (
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-zinc-900">
        {display.title}
      </p>
      {display.body && (
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-zinc-600">
          {display.body}
        </p>
      )}
      <p className="mt-1.5 text-[11px] text-zinc-400">
        {formatRelativeTime(item.createdAt, dict.time)}
      </p>
    </>
  );
}
