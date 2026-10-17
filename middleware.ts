import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  adminEntry,
  createGateToken,
  verifyGateToken,
  GATE_COOKIE,
} from "./server/admin-gate.mjs";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let canonical: string;
  try {
    canonical = decodeURIComponent(pathname)
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/")
      .toLowerCase();
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  const headers = new Headers(request.headers);
  headers.delete("x-csb-admin-area");
  const entry = adminEntry();
  const hiddenHeaders = {
    "cache-control": "private, no-store",
    "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
    "referrer-policy": "no-referrer",
  };
  const missing = () =>
    new NextResponse("Not found", { status: 404, headers: hiddenHeaders });
  if (
    canonical === "/admin" ||
    canonical.startsWith("/admin/") ||
    canonical === "/admin.html"
  )
    return missing();
  if (entry && pathname === entry) {
    headers.set("x-csb-admin-area", "1");
    const target = request.nextUrl.clone();
    target.pathname = "/admin";
    const response = NextResponse.rewrite(target, { request: { headers } });
    for (const [key, value] of Object.entries(hiddenHeaders))
      response.headers.set(key, value);
    response.cookies.set(
      GATE_COOKIE,
      await createGateToken(process.env.JWT_SECRET!, entry),
      {
        httpOnly: true,
        sameSite: "strict",
        secure: request.nextUrl.protocol === "https:",
        path: "/",
        maxAge: 12 * 3600,
      },
    );
    return response;
  }
  if (canonical === "/api/admin" || canonical.startsWith("/api/admin/")) {
    if (
      !(await verifyGateToken(
        request.cookies.get(GATE_COOKIE)?.value,
        process.env.JWT_SECRET,
        entry,
      ))
    )
      return missing();
    const response = NextResponse.next({ request: { headers } });
    for (const [key, value] of Object.entries(hiddenHeaders))
      response.headers.set(key, value);
    return response;
  }
  if (pathname.endsWith(".html")) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/index.html" ? "/" : pathname.slice(0, -5) || "/";
    // A legacy spelling must not redirect to a protected path.
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/"))
      return missing();
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request: { headers } });
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
