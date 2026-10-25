import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(80, "Name must not exceed 80 characters."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(12, "Password must contain at least 12 characters.")
    .max(128, "Password must not exceed 128 characters."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Invalid credentials."),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .regex(/^[a-f0-9]{64}$/i, "Invalid or expired password reset link."),

  password: z
    .string()
    .min(12, "Password must contain at least 12 characters.")
    .max(128, "Password must not exceed 128 characters."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
