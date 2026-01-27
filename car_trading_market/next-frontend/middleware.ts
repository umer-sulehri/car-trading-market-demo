import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const user = req.cookies.get("user")?.value;
  const path = req.nextUrl.pathname;

  // Allow unauthenticated access to sell-car and login pages
  if (!token && path !== "/login" && path !== "/sell-car") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/admin") && !user?.includes("admin")) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
