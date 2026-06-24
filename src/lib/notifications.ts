import { createUserNotification } from "@/lib/create-user-notification";
import { sendPushToUser } from "@/lib/push-notifications";
import { getProjectPath } from "@/lib/slug";
import { MESSAGE_NOTIFICATION_TYPES } from "@/lib/messages-inbox";
import { prisma } from "@/lib/prisma";

const nonMessageNotificationFilter = {
  type: { notIn: [...MESSAGE_NOTIFICATION_TYPES] },
};

export async function getUserNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId, ...nonMessageNotificationFilter },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      link: true,
      readAt: true,
      createdAt: true,
    },
  });
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null, ...nonMessageNotificationFilter },
  });
}

export async function notifyFreelancersAboutNewProject(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { category: { select: { id: true, name: true } } },
  });

  if (!project?.categoryId || project.status !== "OPEN") {
    return 0;
  }

  const freelancers = await prisma.user.findMany({
    where: {
      role: "FREELANCER",
      id: { not: project.clientId },
      freelancerProfile: {
        wantsFreelanceProjects: true,
        workAvailability: { notIn: ["NOT_WORKING", "ON_VACATION"] },
        skills: { some: { categoryId: project.categoryId } },
      },
    },
    select: {
      id: true,
      settings: { select: { emailProjectDigest: true } },
    },
  });

  if (freelancers.length === 0) {
    return 0;
  }

  const link = getProjectPath({ id: project.id, slug: project.slug });
  const categoryName = project.category?.name ?? "Проект";
  const body = `${categoryName} · ${project.title}`;

  const data = freelancers.map((freelancer) => ({
    userId: freelancer.id,
    type: "PROJECT_MATCH" as const,
    title: "Новый проект в вашей категории",
    body,
    link,
    metadata: {
      projectId: project.id,
      categoryId: project.categoryId,
    },
  }));

  await prisma.notification.createMany({ data });

  await Promise.all(
    data.map((item) =>
      sendPushToUser(item.userId, {
        title: item.title,
        body: item.body ?? "",
        url: item.link ?? undefined,
      }),
    ),
  );

  return data.length;
}

export async function notifyFreelancerBidAccepted(
  projectId: string,
  freelancerId: string,
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { name: true } },
      conversation: { select: { id: true } },
    },
  });

  if (!project) {
    return;
  }

  const link = project.conversation
    ? `/messages/${project.conversation.id}`
    : getProjectPath({ id: project.id, slug: project.slug });

  const clientName = project.client.name ?? "Заказчик";

  await createUserNotification({
    userId: freelancerId,
    type: "BID_ACCEPTED",
    title: "Вас выбрали исполнителем",
    body: `${clientName} · ${project.title}`,
    link,
    metadata: {
      projectId: project.id,
      conversationId: project.conversation?.id ?? null,
    },
  });
}

export async function notifyClientNewBid({
  clientId,
  freelancerId,
  projectId,
  projectSlug,
  projectTitle,
  bidId,
}: {
  clientId: string;
  freelancerId: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  bidId: string;
}) {
  const freelancer = await prisma.user.findUnique({
    where: { id: freelancerId },
    select: { name: true },
  });

  const freelancerName = freelancer?.name ?? "Фрилансер";

  await createUserNotification({
    userId: clientId,
    type: "NEW_BID",
    title: "Новый отклик на проект",
    body: `${freelancerName} · ${projectTitle}`,
    link: getProjectPath({ id: projectId, slug: projectSlug }),
    metadata: {
      projectId,
      bidId,
      freelancerId,
    },
  });
}

export async function notifyBidMessage({
  recipientId,
  senderId,
  projectId,
  projectSlug,
  projectTitle,
  bidId,
  content,
}: {
  recipientId: string;
  senderId: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  bidId: string;
  content: string;
}) {
  if (recipientId === senderId) {
    return;
  }

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { name: true },
  });

  const senderName = sender?.name ?? "Участник";
  const preview =
    content.length > 120 ? `${content.slice(0, 117)}…` : content;

  await createUserNotification({
    userId: recipientId,
    type: "BID_MESSAGE",
    title: "Новое сообщение по отклику",
    body: `${senderName} · ${projectTitle}`,
    link: getProjectPath({ id: projectId, slug: projectSlug }),
    metadata: {
      projectId,
      bidId,
      senderId,
      preview,
    },
  });
}

export async function markBidMessageNotificationsReadForProject(
  userId: string,
  projectId: string,
): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      type: "BID_MESSAGE",
      readAt: null,
      metadata: {
        path: ["projectId"],
        equals: projectId,
      },
    },
    data: { readAt: new Date() },
  });

  return result.count;
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<boolean> {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId, readAt: null },
    data: { readAt: new Date() },
  });

  return result.count > 0;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null, ...nonMessageNotificationFilter },
    data: { readAt: new Date() },
  });

  return result.count;
}
