// middleware.ts - Edge compatible only
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only handle session cart in middleware (edge compatible)
  if (!req.cookies.get("sessionCartId")) {
    const newId = crypto.randomUUID();
    res.cookies.set("sessionCartId", newId, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"], // Exclude API routes
  runtime: "experimental-edge",
};
