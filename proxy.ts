// import { NextResponse, type NextRequest } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isAdminRoute = pathname.startsWith("/admin");
//   const isDashboardRoute = pathname.startsWith("/dashboard");

//   const isProtectedRoute = isAdminRoute || isDashboardRoute;

//   // TODO: Add custom session-token validation.
//   // Do not treat the mere presence of a cookie as proof of authentication.

//   if (isProtectedRoute) {
//     const loginUrl = new URL("/auth/login", request.url);

//     loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);

//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/dashboard/:path*"],
// };

import { NextResponse, type NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  // Temporary debugging only.
  // This does NOT protect admin or dashboard routes.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
