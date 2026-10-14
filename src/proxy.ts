import { NextResponse, type NextRequest } from "next/server";

// The old WordPress site used /News. next.config redirects match case-insensitively,
// which turned /News -> /news into a loop, so the exact-case check lives here.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/News") {
    const url = request.nextUrl.clone();
    url.pathname = "/news";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/News", "/news"] };
