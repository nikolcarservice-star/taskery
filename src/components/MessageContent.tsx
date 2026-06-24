"use client";

import { useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import {
  buildLeavePath,
  normalizeExternalUrl,
  segmentMessageContent,
} from "@/lib/external-links";
import {
  parseMessageDisplayBlocks,
  type InlineMessageNode,
  type MessageDisplayBlock,
} from "@/lib/message-display";
import { isSafeHttpUrl } from "@/lib/safe-url";
import type { AppLocale } from "@/lib/i18n/types";
import type { ReactNode } from "react";

type MessageContentProps = {
  content: string;
  warnExternalLinks?: boolean;
  inverse?: boolean;
};

function resolveMarkdownLinkHref(
  rawHref: string,
  locale: AppLocale,
  warnExternalLinks: boolean,
): { href: string; external: boolean } | null {
  const trimmed = rawHref.trim();
  if (!trimmed) {
    return null;
  }

  const externalUrl = normalizeExternalUrl(trimmed);
  if (externalUrl) {
    return {
      href: warnExternalLinks
        ? buildLeavePath(locale, externalUrl)
        : externalUrl,
      external: true,
    };
  }

  if (isSafeHttpUrl(trimmed)) {
    return { href: trimmed, external: true };
  }

  return null;
}

function renderAutoLinkedText(
  text: string,
  locale: AppLocale,
  warnExternalLinks: boolean,
  inverse: boolean,
  keyPrefix: string,
): ReactNode[] {
  return segmentMessageContent(text, locale, warnExternalLinks).map(
    (segment, index) => {
      const key = `${keyPrefix}-seg-${index}`;

      if (segment.type === "text") {
        return <span key={key}>{segment.value}</span>;
      }

      const className = inverse
        ? "font-medium underline decoration-white/50 underline-offset-2 hover:decoration-white"
        : segment.external
          ? "font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800"
          : "font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-800";

      return (
        <a
          key={key}
          href={segment.href}
          target={segment.external && !warnExternalLinks ? "_blank" : undefined}
          rel={segment.external ? "noopener noreferrer" : undefined}
          className={className}
        >
          {segment.value}
        </a>
      );
    },
  );
}

function renderInlineNodes(
  nodes: InlineMessageNode[],
  locale: AppLocale,
  warnExternalLinks: boolean,
  inverse: boolean,
  keyPrefix: string,
): ReactNode[] {
  const result: ReactNode[] = [];

  for (const [index, node] of nodes.entries()) {
    const key = `${keyPrefix}-inline-${index}`;

    if (node.type === "text") {
      result.push(
        ...renderAutoLinkedText(
          node.value,
          locale,
          warnExternalLinks,
          inverse,
          key,
        ),
      );
      continue;
    }

    if (node.type === "bold") {
      result.push(
        <strong
          key={key}
          className={inverse ? "font-semibold text-white" : "font-semibold"}
        >
          {node.value}
        </strong>,
      );
      continue;
    }

    if (node.type === "italic") {
      result.push(
        <em key={key} className={inverse ? "italic text-white/95" : "italic"}>
          {node.value}
        </em>,
      );
      continue;
    }

    const resolved = resolveMarkdownLinkHref(
      node.href,
      locale,
      warnExternalLinks,
    );

    if (!resolved) {
      result.push(<span key={key}>{node.label}</span>);
      continue;
    }

    const className = inverse
      ? "font-medium underline decoration-white/50 underline-offset-2 hover:decoration-white"
      : resolved.external
        ? "font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800"
        : "font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-800";

    result.push(
      <a
        key={key}
        href={resolved.href}
        target={resolved.external && !warnExternalLinks ? "_blank" : undefined}
        rel={resolved.external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {node.label}
      </a>,
    );
  }

  return result;
}

function renderBlock(
  block: MessageDisplayBlock,
  locale: AppLocale,
  warnExternalLinks: boolean,
  inverse: boolean,
  index: number,
): ReactNode {
  if (block.type === "list") {
    return (
      <ul
        key={`block-${index}`}
        className={`list-disc space-y-1 pl-5 ${
          inverse ? "marker:text-white/80" : "marker:text-zinc-400"
        }`}
      >
        {block.items.map((item, itemIndex) => (
          <li key={`block-${index}-item-${itemIndex}`}>
            {renderInlineNodes(
              item,
              locale,
              warnExternalLinks,
              inverse,
              `block-${index}-item-${itemIndex}`,
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={`block-${index}`} className="whitespace-pre-wrap">
      {renderInlineNodes(
        block.children,
        locale,
        warnExternalLinks,
        inverse,
        `block-${index}`,
      )}
    </p>
  );
}

export function MessageContent({
  content,
  warnExternalLinks = false,
  inverse = false,
}: MessageContentProps) {
  const locale = useDictionaryLocale();
  const blocks = parseMessageDisplayBlocks(content);

  return (
    <div className="space-y-2 break-words">
      {blocks.map((block, index) =>
        renderBlock(block, locale, warnExternalLinks, inverse, index),
      )}
    </div>
  );
}
