import {
  adminBidReviewPath,
  adminConversationReviewPath,
} from "@/lib/admin-review-paths";
import { AdminAttentionDismissButton } from "@/components/admin/AdminAttentionDismissButton";
import type { ModerationAttentionItem } from "@/lib/queries/admin-attention";
import Link from "next/link";

type AdminAttentionPanelProps = {
  items: ModerationAttentionItem[];
  moderationBackHref?: string;
};

const SOURCE_LABELS: Record<ModerationAttentionItem["source"], string> = {
  conversation: "Чат проекта",
  bid: "Переписка по отклику",
};

export function AdminAttentionPanel({
  items,
  moderationBackHref = "/admin",
}: AdminAttentionPanelProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900">Внимание (0)</h2>
        <p className="mt-3 text-sm text-zinc-600">
          Попыток обойти правила общения не зафиксировано
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-amber-300 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">
        Внимание ({items.length})
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Попытки отправить внешние контакты или ссылки до оплаты проекта
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-amber-100 bg-amber-50/60 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-amber-900">
                  {SOURCE_LABELS[item.source]}
                </span>
                <span className="text-zinc-500">
                  {new Date(item.createdAt).toLocaleString("ru-RU")}
                </span>
              </div>
              <AdminAttentionDismissButton attentionItemId={item.id} />
            </div>

            <a
              href={`/projects/${item.project.slug}`}
              className="mt-2 block font-medium text-zinc-900 hover:text-blue-600"
            >
              {item.project.title}
            </a>

            <p className="mt-1 text-sm text-zinc-700">
              Пользователь:{" "}
              <a
                href={`/freelancers/${item.violationUser.id}`}
                className="font-medium hover:text-blue-600"
              >
                {item.violationUser.name ?? item.violationUser.email}
              </a>
            </p>

            {item.blockedSnippet && (
              <p className="mt-2 rounded-lg border border-amber-100 bg-white px-3 py-2 text-xs leading-relaxed text-zinc-600">
                Заблокированный текст: «{item.blockedSnippet}»
              </p>
            )}

            {item.source === "conversation" && item.conversationId && (
              <Link
                href={adminConversationReviewPath(
                  item.conversationId,
                  moderationBackHref,
                )}
                className="mt-3 inline-flex items-center rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Открыть переписку
              </Link>
            )}

            {item.source === "bid" && item.bidId && (
              <Link
                href={adminBidReviewPath(item.bidId, moderationBackHref)}
                className="mt-3 inline-flex items-center rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Открыть переписку
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
