import "server-only";

import { createHash, randomBytes } from "node:crypto";
import prisma from "@/lib/prisma";
import { AuthTokenType } from "@/generated/prisma/client";

const TOKEN_EXPIRY = {
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
} as const;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAuthToken(userId: string, type: AuthTokenType) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY[type]);

  // Invalidate existing unused tokens of the same type.
  await prisma.authToken.updateMany({
    where: {
      userId,
      type,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  await prisma.authToken.create({
    data: {
      userId,
      type,
      tokenHash,
      expiresAt,
    },
  });

  return { token: rawToken, expiresAt };
}

export async function validateAuthToken(rawToken: string, type: AuthTokenType) {
  if (!/^[a-f0-9]{64}$/i.test(rawToken)) {
    return null;
  }

  const tokenHash = hashToken(rawToken);

  const authToken = await prisma.authToken.findUnique({
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
    authToken.type !== type ||
    authToken.usedAt !== null ||
    authToken.expiresAt <= new Date()
  ) {
    return null;
  }

  return {
    id: authToken.id,
    userId: authToken.userId,
  };
}

// Keep your existing createPasswordReset() function.

export async function validatePasswordResetToken(rawToken: string) {
  const validatedToken = await validateAuthToken(
    rawToken,
    AuthTokenType.PASSWORD_RESET,
  );

  if (!validatedToken) {
    return {
      valid: false as const,
      message: "Invalid or expired password reset link.",
    };
  }

  return {
    valid: true as const,
    userId: validatedToken.userId,
    tokenId: validatedToken.id,
  };
}
