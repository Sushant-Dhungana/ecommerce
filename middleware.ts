import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const res = NextResponse.next();

  // check if cookie exists
  if (!req.cookies.get("sessionCartId")) {
    const newId = crypto.randomUUID();

    res.cookies.set("sessionCartId", newId, {
      path: "/",
      httpOnly: false, // keep false for testing so you can see it in Application tab
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return res;
});
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  runtime: "edge", // Change from "nodejs" to "edge"
};
