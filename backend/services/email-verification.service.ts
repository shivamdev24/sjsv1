import "server-only";

import prisma from "@/lib/prisma";

import { createHash } from "node:crypto";
import { AuthTokenType } from "@/generated/prisma/client";
import { createAuthToken } from "@/lib/auth/token";

export async function createEmailVerification(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error("User not found or inactive.");
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified.");
  }

  const { token, expiresAt } = await createAuthToken(
    user.id,
    AuthTokenType.EMAIL_VERIFICATION,
  );

  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error("APP_URL is not configured.");
  }

  const verificationUrl = new URL("/auth/verify-email", appUrl);
  verificationUrl.searchParams.set("token", token);

  return {
    email: user.email,
    verificationUrl: verificationUrl.toString(),
    expiresAt,
  };
}

export async function verifyEmail(rawToken: string) {
  if (!/^[a-f0-9]{64}$/i.test(rawToken)) {
    return { success: false, message: "Invalid or expired verification link." };
  }

  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  return prisma.$transaction(async (tx) => {
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
      authToken.type !== AuthTokenType.EMAIL_VERIFICATION ||
      authToken.usedAt !== null ||
      authToken.expiresAt <= new Date()
    ) {
      return {
        success: false,
        message: "Invalid or expired verification link.",
      };
    }

    const consumed = await tx.authToken.updateMany({
      where: {
        id: authToken.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    if (consumed.count !== 1) {
      return {
        success: false,
        message: "Invalid or expired verification link.",
      };
    }

    const updatedUser = await tx.user.updateMany({
      where: {
        id: authToken.userId,
        isActive: true,
        emailVerified: null,
      },
      data: { emailVerified: new Date() },
    });

    if (updatedUser.count !== 1) {
      throw new Error("User could not be verified.");
    }

    return {
      success: true,
      message: "Email verified successfully. You can now sign in.",
    };
  });
}
