"use server";

import { actionError, ActionErrorCode } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { createConnectOnboardingLink } from "@/lib/stripe-connect";
import { stripeConnectEnabled } from "@/lib/stripe-config";
import { redirect } from "next/navigation";

export type StripeConnectState = {
  error?: string;
};

export async function startStripeConnectOnboarding(
  _prevState: StripeConnectState,
  _formData: FormData,
): Promise<StripeConnectState> {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError(ActionErrorCode.AUTH_REQUIRED);
  }

  if (session.user.role !== "FREELANCER" && session.user.role !== "ADMIN") {
    return actionError(ActionErrorCode.FREELANCERS_ONLY);
  }

  if (!stripeConnectEnabled) {
    return { error: "Stripe Connect не включён на сервере" };
  }

  const basePath =
    session.user.role === "ADMIN"
      ? "/dashboard/personal"
      : "/dashboard/personal";

  const returnUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}${basePath}?tab=payment&connect=return`;
  const refreshUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}${basePath}?tab=payment&connect=refresh`;

  try {
    const url = await createConnectOnboardingLink(
      session.user.id,
      returnUrl,
      refreshUrl,
    );
    redirect(url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось открыть Stripe Connect";
    return { error: message };
  }
}
