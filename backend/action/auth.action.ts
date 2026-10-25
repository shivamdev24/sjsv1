"use server";

import prisma from "@/lib/prisma";
import { registerUser } from "@/backend/services/auth.service";
import { createEmailVerification } from "@/backend/services/email-verification.service";
import { sendVerificationEmail } from "@/lib/email";
import { loginSchema } from "@/backend/schemas/auth.schema";
import type { AuthActionState } from "@/backend/schemas/auth-state";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  setSessionCookie,
  getSessionCookieToken,
  clearSessionCookie,
} from "@/lib/auth/cookie";
import { revokeSession } from "@/lib/auth/session";

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = await registerUser({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  try {
    const verification = await createEmailVerification(result.userId);

    await sendVerificationEmail(
      verification.email,
      verification.verificationUrl,
    );

    return {
      success: true,
      message:
        "Registration successful. Check your email for the verification link before signing in.",
    };
  } catch (error) {
    console.error("Verification email delivery failed:", error);

    return {
      success: true,
      message:
        "Your account was created, but the verification email could not be sent. Please contact support or use the resend verification option when available.",
    };
  }
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email and password.",
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
      emailVerified: true,
      isActive: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      message: "This account is inactive. Contact support.",
    };
  }

  if (!user.emailVerified) {
    return {
      success: false,
      message: "Please verify your email before signing in.",
    };
  }

  const { token, expiresAt } = await createSession(user.id);

  await setSessionCookie(token, expiresAt);

  const roleNames = user.roles.map((userRole) => userRole.role.name);

  if (roleNames.includes("SUPER_ADMIN") || roleNames.includes("ADMIN")) {
    redirect("/admin");
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const token = await getSessionCookieToken();

  try {
    await revokeSession(token);
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    await clearSessionCookie();
  }

  redirect("/auth/login");
}
