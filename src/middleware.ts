import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cookie = request.cookies.get("auth")?.value;

  if (path === "/" && !cookie) {
    return NextResponse.next();
  }

  if (path === "/login" && !cookie) {
    return NextResponse.next();
  }

  if (path !== "/" && !cookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path === "/login" && cookie) {
    return NextResponse.redirect(new URL("/images", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
