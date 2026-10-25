import "server-only";

import { createHash } from "node:crypto";
import { AuthTokenType } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/auth/token";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/backend/schemas/auth.schema";

const INVALID_TOKEN_MESSAGE = "Invalid or expired password reset link.";

export async function createPasswordReset(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error("User not found or inactive.");
  }

  const { token, expiresAt } = await createAuthToken(
    user.id,
    AuthTokenType.PASSWORD_RESET,
  );

  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error("APP_URL is not configured.");
  }

  const resetUrl = new URL("/auth/reset-password", appUrl);
  resetUrl.searchParams.set("token", token);

  return {
    email: user.email,
    resetUrl: resetUrl.toString(),
    expiresAt,
  };
}

export async function validatePasswordResetToken(rawToken: string) {
  if (!/^[a-f0-9]{64}$/i.test(rawToken)) {
    return { valid: false as const, message: INVALID_TOKEN_MESSAGE };
  }

  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  const authToken = await prisma.authToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      type: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  if (
    !authToken ||
    authToken.type !== AuthTokenType.PASSWORD_RESET ||
    authToken.usedAt !== null ||
    authToken.expiresAt <= new Date()
  ) {
    return { valid: false as const, message: INVALID_TOKEN_MESSAGE };
  }

  return { valid: true as const, tokenHash };
}

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { token, password } = parsed.data;

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return {
      success: false,
      message: "Invalid or expired password reset link.",
    };
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const passwordHash = await hashPassword(password);

  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const authToken = await tx.authToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        type: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (
      !authToken ||
      authToken.type !== AuthTokenType.PASSWORD_RESET ||
      authToken.usedAt !== null ||
      authToken.expiresAt <= now
    ) {
      return {
        success: false,
        message: "Invalid or expired password reset link.",
      };
    }

    const consumed = await tx.authToken.updateMany({
      where: {
        id: authToken.id,
        type: AuthTokenType.PASSWORD_RESET,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });

    if (consumed.count !== 1) {
      return {
        success: false,
        message: "Invalid or expired password reset link.",
      };
    }

    await tx.user.update({
      where: { id: authToken.userId },
      data: { passwordHash },
    });

    // Revoke existing sessions after the password changes.
    await tx.session.updateMany({
      where: {
        userId: authToken.userId,
        revokedAt: null,
      },
      data: { revokedAt: now },
    });

    return {
      success: true,
      message: "Password reset successfully. You can now sign in.",
    };
  });
}
