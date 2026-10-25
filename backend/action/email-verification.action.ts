"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { createEmailVerification } from "@/backend/services/email-verification.service";
import { sendVerificationEmail } from "@/lib/email";
import type { AuthActionState } from "@/backend/schemas/auth-state";

export async function resendVerificationAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z
    .object({
      email: z
        .string()
        .trim()
        .email()
        .transform((value) => value.toLowerCase()),
    })
    .safeParse({
      email: formData.get("email"),
    });

  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid email address.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: {
      id: true,
      emailVerified: true,
      isActive: true,
    },
  });

  // Use a generic response to avoid revealing account existence.
  const genericMessage =
    "If your account exists and needs verification, a verification email will be sent.";

  if (!user || !user.isActive || user.emailVerified) {
    return { success: true, message: genericMessage };
  }

  try {
    const verification = await createEmailVerification(user.id);

    await sendVerificationEmail(
      verification.email,
      verification.verificationUrl,
    );
  } catch (error) {
    console.error("Resending verification email failed:", error);

    return {
      success: false,
      message:
        "Unable to send the verification email right now. Please try again later.",
    };
  }

  return { success: true, message: genericMessage };
}
