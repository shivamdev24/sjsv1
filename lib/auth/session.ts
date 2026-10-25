import "server-only";

import { createHash, randomBytes } from "node:crypto";
import prisma from "@/lib/prisma";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getSession(token: string | undefined) {
  if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
      },
    },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    !session.user.isActive
  ) {
    return null;
  }

  return {
    id: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      roles: session.user.roles.map(({ role }) => role.name),
    },
  };
}

export async function revokeSession(token: string | undefined) {
  if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
    return;
  }

  await prisma.session.updateMany({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
