import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isAuthenticated = (request: NextRequest): boolean => {
  const token = request.cookies.get("auth-token")?.value;
  return !!token;
};

const protectedRoutes = ["/profile", "/my-events", "/create-event"];

export function middleware(request: NextRequest) {
  const isUserAuthenticated = isAuthenticated(request);
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isUserAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/", "/my-events/:path*", "/create-event"],
};
