import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const userCookie = req.cookies.get("user")?.value;
  const path = req.nextUrl.pathname;

  let userRole = null;
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie);
      userRole = userData.role;
    } catch (e) {
      // Cookie parse error, treat as no user
    }
  }

  // ========================================
  // ADMIN ROUTES - Require authentication + admin role
  // ========================================
  if (path.startsWith("/admin")) {
    // Check if authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check if admin role (verify on backend, use frontend for UX)
    // Note: Backend middleware will also verify this
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }

    return NextResponse.next();
  }

  // ========================================
  // USER DASHBOARD ROUTES - Require authentication
  // ========================================
  if (path.startsWith("/user")) {
    // Check if authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
