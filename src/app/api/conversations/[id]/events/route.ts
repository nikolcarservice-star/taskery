import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id: conversationId } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { clientId: true, freelancerId: true },
  });

  if (!conversation) {
    return new Response("Not found", { status: 404 });
  }

  const isParticipant =
    conversation.clientId === session.user.id ||
    conversation.freelancerId === session.user.id ||
    session.user.role === "ADMIN";

  if (!isParticipant) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const sinceParam = url.searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : new Date(0);

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      send("ready", { conversationId, since: since.toISOString() });

      while (!closed) {
        const latest = await prisma.message.findFirst({
          where: {
            conversationId,
            createdAt: { gt: since },
          },
          orderBy: { createdAt: "desc" },
          select: { id: true, createdAt: true },
        });

        if (latest) {
          send("update", {
            messageId: latest.id,
            at: latest.createdAt.toISOString(),
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    },
    cancel() {
      closed = true;
    },
  });

  request.signal.addEventListener("abort", () => {
    closed = true;
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
