"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { requireModerationAdmin } from "@/lib/actions/admin-moderation";
import { actionError } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { createLocalizedUserNotification } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import type { SupportTicketCategory } from "@/generated/prisma/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export type TicketActionState = { error?: string; success?: boolean };

const TICKET_CATEGORIES: SupportTicketCategory[] = [
  "GENERAL",
  "PAYMENT",
  "DISPUTE",
  "ACCOUNT",
  "OTHER",
];

function parseCategory(value: string | null): SupportTicketCategory | null {
  if (!value) return null;
  return TICKET_CATEGORIES.includes(value as SupportTicketCategory)
    ? (value as SupportTicketCategory)
    : null;
}

async function notifyTicketUser(
  userId: string,
  ticketId: string,
  template: "SUPPORT_REPLY" | "SUPPORT_TICKET_CLOSED" | "SUPPORT_TICKET_RESOLVED",
  ticketSubject: string,
) {
  await createLocalizedUserNotification({
    userId,
    type: "SUPPORT_REPLY",
    template,
    variables: { ticketSubject },
    link: `/support/${ticketId}`,
  });
}

export async function createSupportTicket(
  _prevState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const subject = (formData.get("subject") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();
  const category = parseCategory(
    (formData.get("category") as string | null)?.trim() ?? null,
  );

  if (!subject || subject.length < 3) {
    return actionError("TICKET_SUBJECT_REQUIRED");
  }
  if (!message || message.length < 10) {
    return actionError("CONTACT_MESSAGE_TOO_SHORT");
  }

  const limited = checkRateLimit(`ticket:${session.user.id}`, 5, 3_600_000);
  if (!limited.ok) return actionError("RATE_LIMIT_EXCEEDED");

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: session.user.id,
      subject,
      category: category ?? "GENERAL",
      messages: {
        create: {
          senderId: session.user.id,
          content: message,
          isStaff: false,
        },
      },
    },
  });

  revalidatePath("/support");
  return { success: true };
}

export async function replySupportTicket(
  _prevState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const session = await auth();
  if (!session?.user?.id) return actionError("AUTH_REQUIRED");

  const ticketId = (formData.get("ticketId") as string | null)?.trim();
  const content = (formData.get("content") as string | null)?.trim();

  if (!ticketId || !content) return actionError("MESSAGE_REQUIRED");

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true, status: true, subject: true },
  });

  if (!ticket || ticket.status === "CLOSED") {
    return actionError("TICKET_NOT_FOUND_OR_CLOSED");
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && ticket.userId !== session.user.id) {
    return actionError("ACCESS_DENIED");
  }

  if (isAdmin) {
    const authResult = await requireModerationAdmin();
    if ("error" in authResult) return { error: authResult.error };
  }

  await prisma.$transaction([
    prisma.supportTicketMessage.create({
      data: {
        ticketId,
        senderId: session.user.id,
        content,
        isStaff: isAdmin,
      },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        updatedAt: new Date(),
        ...(isAdmin
          ? { status: "IN_PROGRESS" as const, assignedToId: session.user.id }
          : {}),
      },
    }),
  ]);

  if (isAdmin) {
    await notifyTicketUser(
      ticket.userId,
      ticketId,
      "SUPPORT_REPLY",
      ticket.subject,
    );
    await logAdminAction(session.user.id, "TICKET_REPLY", {
      targetType: "ticket",
      targetId: ticketId,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/mobile/support");
  } else {
    revalidatePath(`/support/${ticketId}`);
  }

  revalidatePath("/support");
  return { success: true };
}

export async function closeSupportTicket(
  _prevState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const ticketId = (formData.get("ticketId") as string | null)?.trim();
  if (!ticketId) return actionError("TICKET_NOT_FOUND");

  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
    },
    select: { userId: true, subject: true },
  });

  await notifyTicketUser(
    ticket.userId,
    ticketId,
    "SUPPORT_TICKET_CLOSED",
    ticket.subject,
  );

  await logAdminAction(authResult.admin.id, "TICKET_CLOSE", {
    targetType: "ticket",
    targetId: ticketId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/support");
  revalidatePath("/support");
  return { success: true };
}

export async function resolveSupportTicket(
  _prevState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const ticketId = (formData.get("ticketId") as string | null)?.trim();
  if (!ticketId) return actionError("TICKET_NOT_FOUND");

  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: "RESOLVED" },
    select: { userId: true, subject: true },
  });

  await notifyTicketUser(
    ticket.userId,
    ticketId,
    "SUPPORT_TICKET_RESOLVED",
    ticket.subject,
  );

  await logAdminAction(authResult.admin.id, "TICKET_RESOLVE", {
    targetType: "ticket",
    targetId: ticketId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/support");
  return { success: true };
}

export async function assignSupportTicket(
  _prevState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const authResult = await requireModerationAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const ticketId = (formData.get("ticketId") as string | null)?.trim();
  const assigneeId = (formData.get("assigneeId") as string | null)?.trim();

  if (!ticketId || !assigneeId) {
    return actionError("TICKET_ASSIGNMENT_REQUIRED");
  }

  const assignee = await prisma.user.findFirst({
    where: { id: assigneeId, role: "ADMIN", adminActive: true },
    select: { id: true },
  });

  if (!assignee) {
    return actionError("ADMIN_NOT_FOUND");
  }

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      assignedToId: assigneeId,
      status: "IN_PROGRESS",
    },
  });

  await logAdminAction(authResult.admin.id, "TICKET_ASSIGN", {
    targetType: "ticket",
    targetId: ticketId,
    details: { assigneeId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/support");
  return { success: true };
}
