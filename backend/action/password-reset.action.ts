"use server";

import { z } from "zod";
import { requestPasswordReset } from "@/backend/services/password-reset-email.service";
import { resetPassword } from "@/backend/services/password-reset.service";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long.")
    .transform((value) => value.toLowerCase()),
});

export async function forgotPasswordAction(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid email address.",
    };
  }

  return requestPasswordReset(parsed.data.email);
}

// Add this below forgotPasswordAction.

export async function resetPasswordAction(input: unknown) {
  return resetPassword(input);
}
