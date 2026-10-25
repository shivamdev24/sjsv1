import "server-only";

import prisma from "@/lib/prisma";
import { createPasswordReset } from "@/backend/services/password-reset.service";
import { sendPasswordResetEmail } from "@/lib/email";

export async function requestPasswordReset(emailInput: unknown) {
  const email =
    typeof emailInput === "string" ? emailInput.trim().toLowerCase() : "";

  // Return the same response regardless of whether the account exists.
  const genericResult = {
    success: true,
    message:
      "If an eligible account exists for that email, a reset link will be sent.",
  };

  if (!email || email.length > 254) {
    return genericResult;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user || !user.isActive || !user.emailVerified) {
      return genericResult;
    }

    const { email: recipient, resetUrl } = await createPasswordReset(user.id);

    await sendPasswordResetEmail(recipient, resetUrl);

    return genericResult;
  } catch (error) {
    console.error("Password reset request failed:", error);
    return genericResult;
  }
}
