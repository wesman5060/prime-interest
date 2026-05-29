import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth proxy seam — reserved for future investor/partner portal.
// To enable: install NextAuth or Clerk and add route protection for /(portal)/* here.
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/(portal)/:path*"],
};
