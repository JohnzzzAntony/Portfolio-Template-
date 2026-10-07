import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "forma_session";

/**
 * Gate for /admin. A fast cookie check at the edge — every admin action
 * still calls `requireSession()` server-side, because middleware alone is not
 * an authorization boundary.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;

  if (token && secret && secret.length >= 32) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
      if (payload.role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url));
      return NextResponse.next();
    } catch {
      // fall through to redirect
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
