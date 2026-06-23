"use client";

import { useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { segmentMessageContent } from "@/lib/external-links";

type MessageContentProps = {
  content: string;
  warnExternalLinks?: boolean;
  inverse?: boolean;
};

export function MessageContent({
  content,
  warnExternalLinks = false,
  inverse = false,
}: MessageContentProps) {
  const locale = useDictionaryLocale();
  const segments = segmentMessageContent(content, locale, warnExternalLinks);

  return (
    <p className="whitespace-pre-wrap break-words">
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.value}</span>;
        }

        const className = inverse
          ? "font-medium underline decoration-white/50 underline-offset-2 hover:decoration-white"
          : segment.external
            ? "font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800"
            : "font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-800";

        return (
          <a
            key={index}
            href={segment.href}
            target={segment.external && !warnExternalLinks ? "_blank" : undefined}
            rel={segment.external ? "noopener noreferrer" : undefined}
            className={className}
          >
            {segment.value}
          </a>
        );
      })}
    </p>
  );
}
