import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/backend/schemas/auth.schema";

export type RegisterResult =
  | {
      success: true;
      message: string;
      userId: string;
    }
  | {
      success: false;
      message: string;
    };

function hasErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Unable to register with this email address.",
      };
    }

    const userRole = await prisma.role.findUnique({
      where: { name: "SUPER_ADMIN" },
      select: { id: true },
    });

    if (!userRole) {
      return {
        success: false,
        message: "Authentication setup is incomplete. Please try again later.",
      };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        roles: {
          create: {
            role: {
              connect: { id: userRole.id },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      message: "Account created successfully.",
      userId: user.id,
    };
  } catch (error) {
    if (hasErrorCode(error, "P2002")) {
      return {
        success: false,
        message: "Unable to register with this email address.",
      };
    }

    console.error("Registration failed:", error);

    return {
      success: false,
      message: "Unable to create your account. Please try again later.",
    };
  }
}
