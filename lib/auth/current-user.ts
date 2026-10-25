import "server-only";

import { getSession } from "@/lib/auth/session";
import { getSessionCookieToken } from "@/lib/auth/cookie";

export async function getCurrentUser() {
  const token = await getSessionCookieToken();
  const session = await getSession(token);

  // const user = {
  //   user: ,
  // };

  console.log(session);

  return session?.user ?? null;
}
