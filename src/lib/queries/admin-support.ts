import { prisma } from "@/lib/prisma";
import type { SupportTicketStatus } from "@/generated/prisma/client";

export type AdminSupportTicketItem = {
  id: string;
  subject: string;
  category: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
  assignedTo: { id: string; name: string | null } | null;
  lastMessage: { content: string; isStaff: boolean; createdAt: string } | null;
  messageCount: number;
};

const OPEN_STATUSES: SupportTicketStatus[] = ["OPEN", "IN_PROGRESS"];

export async function getAdminSupportTickets(
  openOnly = true,
): Promise<AdminSupportTicketItem[]> {
  const tickets = await prisma.supportTicket.findMany({
    where: openOnly ? { status: { in: OPEN_STATUSES } } : undefined,
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, isStaff: true, createdAt: true },
      },
      _count: { select: { messages: true } },
    },
  });

  return tickets.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    category: ticket.category,
    status: ticket.status,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    user: ticket.user,
    assignedTo: ticket.assignedTo,
    lastMessage: ticket.messages[0]
      ? {
          content: ticket.messages[0].content,
          isStaff: ticket.messages[0].isStaff,
          createdAt: ticket.messages[0].createdAt.toISOString(),
        }
      : null,
    messageCount: ticket._count.messages,
  }));
}

export async function getOpenSupportTicketCount(): Promise<number> {
  return prisma.supportTicket.count({
    where: { status: { in: OPEN_STATUSES } },
  });
}

export async function loadSupportTicketDetail(ticketId: string) {
  return prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });
}

export async function getUserSupportTickets(userId: string) {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true, isStaff: true },
      },
      _count: { select: { messages: true } },
    },
  });
}
