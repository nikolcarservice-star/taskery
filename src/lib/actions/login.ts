"use server";

import { isAdminEmail } from "@/lib/actions/auth-hints";
import { authContinuePath } from "@/lib/auth-continue-path";
import { signIn } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { AuthError } from "next-auth";

export type LoginActionState = {
  error?: "invalid" | "admin";
};

export async function loginWithCredentials(
  _prev: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeRedirectPath(
    String(formData.get("callbackUrl") ?? ""),
    "/",
  );

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: authContinuePath(callbackUrl),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (await isAdminEmail(email)) {
        return { error: "admin" };
      }
      return { error: "invalid" };
    }
    throw error;
  }

  return {};
}

export type AdminLoginActionState = {
  error?: "invalid";
};

export async function loginWithAdminCredentials(
  _prev: AdminLoginActionState,
  formData: FormData,
): Promise<AdminLoginActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeRedirectPath(
    String(formData.get("callbackUrl") ?? ""),
    "/cabinet",
  );

  try {
    await signIn("admin", {
      email,
      password,
      redirectTo: authContinuePath(callbackUrl),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid" };
    }
    throw error;
  }

  return {};
}

export async function signInAfterRegister(
  email: string,
  password: string,
  redirectTo: string,
): Promise<void> {
  await signIn("credentials", {
    email: email.trim().toLowerCase(),
    password,
    redirectTo: authContinuePath(redirectTo),
  });
}
