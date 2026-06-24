export type InlineMessageNode =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "link"; label: string; href: string };

export type MessageDisplayBlock =
  | { type: "paragraph"; children: InlineMessageNode[] }
  | { type: "list"; items: InlineMessageNode[][] };

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function parseInlineMessageNodes(text: string): InlineMessageNode[] {
  if (!text) {
    return [{ type: "text", value: "" }];
  }

  const nodes: InlineMessageNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    if (match[1]) {
      nodes.push({ type: "bold", value: match[1] });
    } else if (match[2]) {
      nodes.push({ type: "italic", value: match[2] });
    } else if (match[3] && match[4]) {
      nodes.push({
        type: "link",
        label: match[3],
        href: match[4].trim(),
      });
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", value: text.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: "text", value: text }];
}

export function parseMessageDisplayBlocks(content: string): MessageDisplayBlock[] {
  const lines = content.split("\n");
  const blocks: MessageDisplayBlock[] = [];
  let listItems: InlineMessageNode[][] = [];

  function flushList() {
    if (listItems.length === 0) {
      return;
    }
    blocks.push({ type: "list", items: listItems });
    listItems = [];
  }

  for (const line of lines) {
    if (line.startsWith("- ")) {
      listItems.push(parseInlineMessageNodes(line.slice(2)));
      continue;
    }

    flushList();
    blocks.push({
      type: "paragraph",
      children: parseInlineMessageNodes(line),
    });
  }

  flushList();

  return blocks.length > 0
    ? blocks
    : [{ type: "paragraph", children: [{ type: "text", value: "" }] }];
}
