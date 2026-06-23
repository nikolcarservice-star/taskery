"use server";



import { auth } from "@/lib/auth";

import { notifyFreelancerBidAccepted } from "@/lib/notifications";

import { prisma } from "@/lib/prisma";

import {

  EscrowError,

  atomicFundContract,

  atomicOpenDispute,

  atomicReleaseContract,

} from "@/lib/escrow-ops";

import { getCommissionRate, stripeEnabled } from "@/lib/stripe-config";

import { revalidatePath } from "next/cache";



export type ActionState = {

  error?: string;

  success?: boolean;

};



async function getClientSession() {

  const session = await auth();

  if (!session?.user?.id) {

    return { error: "AUTH_REQUIRED" } as const;

  }

  if (session.user.role !== "CLIENT" && session.user.role !== "ADMIN") {

    return { error: "CLIENTS_ONLY" } as const;

  }

  return { session } as const;

}



function escrowErrorMessage(error: unknown): string {

  if (error instanceof EscrowError) return error.message;

  return "Не удалось выполнить операцию";

}



export async function acceptBid(

  _prevState: ActionState,

  formData: FormData,

): Promise<ActionState> {

  const authResult = await getClientSession();

  if ("error" in authResult) return { error: authResult.error };



  const bidId = (formData.get("bidId") as string | null)?.trim();

  if (!bidId) return { error: "BID_NOT_FOUND" };



  const bid = await prisma.bid.findUnique({

    where: { id: bidId },

    include: {

      project: { include: { contract: true } },

    },

  });



  if (!bid) return { error: "BID_NOT_FOUND" };



  const { session } = authResult;



  if (bid.project.clientId !== session.user.id && session.user.role !== "ADMIN") {

    return { error: "PROJECT_ACCESS_DENIED" };

  }



  if (bid.project.status !== "OPEN") {

    return { error: "ACCEPT_FREELANCER_OPEN_ONLY" };

  }



  if (bid.project.contract) {

    return { error: "FREELANCER_ALREADY_SELECTED" };

  }



  if (bid.status !== "PENDING") {

    return { error: "BID_ALREADY_PROCESSED" };

  }



  const amount = Number(bid.cost);

  if (!Number.isFinite(amount) || amount <= 0) {

    return { error: "INVALID_BID_AMOUNT_CONTRACT" };

  }



  const commissionRate = getCommissionRate();

  const commission = Math.round(amount * commissionRate * 100) / 100;

  const freelancerPayout = amount - commission;



  try {

    await prisma.$transaction(async (tx) => {

      await tx.contract.create({

        data: {

          projectId: bid.projectId,

          clientId: bid.project.clientId,

          freelancerId: bid.freelancerId,

          amount: bid.cost,

          commission,

          freelancerPayout,

          status: "AWAITING_FUNDING",

        },

      });



      await tx.conversation.create({

        data: {

          projectId: bid.projectId,

          clientId: bid.project.clientId,

          freelancerId: bid.freelancerId,

        },

      });



      await tx.project.update({

        where: { id: bid.projectId },

        data: { status: "IN_PROGRESS" },

      });



      await tx.bid.update({

        where: { id: bidId },

        data: { status: "ACCEPTED" },

      });



      await tx.bid.updateMany({

        where: {

          projectId: bid.projectId,

          id: { not: bidId },

          status: "PENDING",

        },

        data: { status: "REJECTED" },

      });

    });

  } catch (error) {

    console.error("[acceptBid]", error);



    if (error instanceof Error) {

      if (error.message.includes("Unique constraint")) {

        return { error: "FREELANCER_ALREADY_SELECTED" };

      }



      if (

        error.message.includes("AWAITING_FUNDING") ||

        error.message.includes('invalid input value for enum')

      ) {

        return {

          error:

            "Схема базы данных устарела. Выполните npm run db:push и перезапустите сервер.",

        };

      }

    }



    return { error: "ACCEPT_FREELANCER_FAILED" };

  }



  const project = await prisma.project.findUnique({

    where: { id: bid.projectId },

    select: { slug: true },

  });



  await notifyFreelancerBidAccepted(bid.projectId, bid.freelancerId);



  revalidatePath(`/projects/${project?.slug ?? bid.projectId}`);

  revalidatePath("/projects/my");

  revalidatePath("/client/projects");

  revalidatePath("/client/work");

  revalidatePath("/client/finances");

  revalidatePath("/profile");

  revalidatePath("/profile/reviews");

  revalidatePath("/dashboard/reviews");

  revalidatePath("/dashboard/finances");

  revalidatePath("/dashboard/work");

  revalidatePath("/dashboard/bids");

  revalidatePath("/notifications");

  revalidatePath("/messages");



  return { success: true };

}



export async function fundContract(

  _prevState: ActionState,

  formData: FormData,

): Promise<ActionState> {

  const authResult = await getClientSession();

  if ("error" in authResult) return { error: authResult.error };



  const projectId = (formData.get("projectId") as string | null)?.trim();

  if (!projectId) return { error: "PROJECT_NOT_FOUND" };



  const project = await prisma.project.findUnique({

    where: { id: projectId },

    include: { contract: true },

  });



  if (!project?.contract) return { error: "CONTRACT_NOT_FOUND" };



  const { session } = authResult;



  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {

    return { error: "ACCESS_DENIED" };

  }



  if (project.status !== "IN_PROGRESS") {

    return { error: "PROJECT_NOT_IN_PROGRESS" };

  }



  if (project.contract.status !== "AWAITING_FUNDING") {

    return { error: "ESCROW_ALREADY_FUNDED" };

  }



  const amount = Number(project.contract.amount);



  try {

    await atomicFundContract(

      project.contract.id,

      project.clientId,

      amount,

    );

  } catch (error) {

    return { error: escrowErrorMessage(error) };

  }



  revalidatePath(`/projects/${project.slug}`);

  revalidatePath("/projects/my");

  revalidatePath("/client/projects");

  revalidatePath("/client/work");

  revalidatePath("/client/finances");

  revalidatePath("/profile");

  revalidatePath("/dashboard/finances");

  revalidatePath("/dashboard/work");

  revalidatePath("/messages");



  return { success: true };

}



export async function releaseContract(

  _prevState: ActionState,

  formData: FormData,

): Promise<ActionState> {

  const authResult = await getClientSession();

  if ("error" in authResult) return { error: authResult.error };



  const projectId = (formData.get("projectId") as string | null)?.trim();

  if (!projectId) return { error: "PROJECT_NOT_FOUND" };



  const project = await prisma.project.findUnique({

    where: { id: projectId },

    include: { contract: true },

  });



  if (!project?.contract) return { error: "CONTRACT_NOT_FOUND" };



  const { session } = authResult;



  if (project.clientId !== session.user.id && session.user.role !== "ADMIN") {

    return { error: "ACCESS_DENIED" };

  }



  if (project.status !== "IN_PROGRESS") {

    return { error: "PROJECT_NOT_IN_PROGRESS" };

  }



  if (project.contract.status !== "ESCROWED") {

    return { error: "FUNDS_ALREADY_PROCESSED" };

  }



  const payout = Number(project.contract.freelancerPayout);

  const commission = Number(project.contract.commission);



  try {

    await atomicReleaseContract(

      project.contract.id,

      projectId,

      project.contract.freelancerId,

      payout,

      commission,

      project.clientId,

    );

  } catch (error) {

    return { error: escrowErrorMessage(error) };

  }



  revalidatePath(`/projects/${project.slug}`);

  revalidatePath("/projects/my");

  revalidatePath("/client/projects");

  revalidatePath("/client/work");

  revalidatePath("/client/finances");

  revalidatePath("/profile");

  revalidatePath("/profile/reviews");

  revalidatePath("/dashboard/reviews");

  revalidatePath("/dashboard/finances");



  return { success: true };

}



export async function openDispute(

  _prevState: ActionState,

  formData: FormData,

): Promise<ActionState> {

  const session = await auth();

  if (!session?.user?.id) {

    return { error: "AUTH_REQUIRED" };

  }



  const projectId = (formData.get("projectId") as string | null)?.trim();

  if (!projectId) return { error: "PROJECT_NOT_FOUND" };



  const project = await prisma.project.findUnique({

    where: { id: projectId },

    include: { contract: true },

  });



  if (!project?.contract) return { error: "CONTRACT_NOT_FOUND" };



  const isClient = project.clientId === session.user.id;

  const isFreelancer = project.contract.freelancerId === session.user.id;

  const isAdmin = session.user.role === "ADMIN";



  if (!isClient && !isFreelancer && !isAdmin) {

    return { error: "ACCESS_DENIED" };

  }



  try {

    await atomicOpenDispute(projectId, project.contract.id);

  } catch (error) {

    return { error: escrowErrorMessage(error) };

  }



  revalidatePath(`/projects/${project.slug}`);

  revalidatePath("/projects/my");

  revalidatePath("/client/projects");

  revalidatePath("/client/work");

  revalidatePath("/client/finances");

  revalidatePath("/dashboard/work");

  revalidatePath("/admin");



  return { success: true };

}



export async function demoTopUpBalance(

  _prevState: ActionState,

): Promise<ActionState> {

  const authResult = await getClientSession();

  if ("error" in authResult) return { error: authResult.error };



  if (process.env.NODE_ENV === "production") {

    return { error: "DEMO_TOPUP_PRODUCTION_ONLY" };

  }



  if (stripeEnabled) {

    return { error: "USE_STRIPE_FOR_TOPUP" };

  }



  await prisma.user.update({

    where: { id: authResult.session.user.id },

    data: { balance: { increment: 50000 } },

  });



  revalidatePath("/profile");

  revalidatePath("/dashboard/finances");

  revalidatePath("/projects/my");

  revalidatePath("/client/projects");

  revalidatePath("/client/work");

  revalidatePath("/client/finances");



  return { success: true };

}


