import type { MessageKind, Role } from "@/generated/prisma/client";

const PARTICIPANT_HIDDEN_KINDS: MessageKind[] = ["DISPUTE_ADMIN_NOTE"];

export function isMessageVisibleToViewer(
  kind: MessageKind,
  viewerRole: Role,
): boolean {
  if (viewerRole === "ADMIN") return true;
  return !PARTICIPANT_HIDDEN_KINDS.includes(kind);
}

export function filterMessagesForViewer<
  T extends { kind: MessageKind },
>(messages: T[], viewerRole: Role | undefined): T[] {
  return messages.filter((message) =>
    isMessageVisibleToViewer(message.kind, viewerRole ?? "CLIENT"),
  );
}

export function participantMessagesWhere(viewerRole: Role | undefined) {
  if (viewerRole === "ADMIN") return {};
  return { kind: { notIn: PARTICIPANT_HIDDEN_KINDS } };
}
