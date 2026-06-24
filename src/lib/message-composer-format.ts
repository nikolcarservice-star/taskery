export type TextareaEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export function wrapTextareaMarkup(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder: string,
): TextareaEdit {
  const selected = value.slice(start, end);
  const inner = selected || placeholder;
  const wrapped = `${before}${inner}${after}`;
  const nextValue = `${value.slice(0, start)}${wrapped}${value.slice(end)}`;

  if (selected) {
    return {
      value: nextValue,
      selectionStart: start,
      selectionEnd: start + wrapped.length,
    };
  }

  const innerStart = start + before.length;
  return {
    value: nextValue,
    selectionStart: innerStart,
    selectionEnd: innerStart + placeholder.length,
  };
}

export function toggleListLine(
  value: string,
  start: number,
  end: number,
): TextareaEdit {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIndex = value.indexOf("\n", Math.max(end - 1, start));
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const line = value.slice(lineStart, lineEnd);

  if (line.startsWith("- ")) {
    const nextValue =
      value.slice(0, lineStart) + line.slice(2) + value.slice(lineEnd);
    const removed = Math.min(2, Math.max(0, start - lineStart));
    const nextStart = Math.max(lineStart, start - removed);
    const nextEnd = Math.max(lineStart, end - removed);

    return {
      value: nextValue,
      selectionStart: nextStart,
      selectionEnd: nextEnd,
    };
  }

  const nextValue =
    value.slice(0, lineStart) + "- " + value.slice(lineStart);

  return {
    value: nextValue,
    selectionStart: start + 2,
    selectionEnd: end + 2,
  };
}

export function insertMarkdownLink(
  value: string,
  start: number,
  end: number,
  linkLabelPlaceholder: string,
): TextareaEdit {
  return wrapTextareaMarkup(
    value,
    start,
    end,
    "[",
    "](https://)",
    linkLabelPlaceholder,
  );
}
