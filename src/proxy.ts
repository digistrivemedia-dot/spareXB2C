import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/features/auth/session-cookie";

/**
 * The shop home is for guests; a logged-in customer's home is their own page. This only checks that a
 * session cookie is there: /account still verifies the session and sends stale ones to log in.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/account", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: "/" };
