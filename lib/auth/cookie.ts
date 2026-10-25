"server action";

import "server-only";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sjs_session";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...cookieOptions,
    expires: expiresAt,
  });
}

export async function getSessionCookieToken() {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...cookieOptions,
    expires: new Date(0),
    maxAge: 0,
  });
}
