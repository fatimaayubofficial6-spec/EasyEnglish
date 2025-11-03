import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/exercise") ||
          pathname.startsWith("/feedback") ||
          pathname.startsWith("/my-pdf") ||
          pathname.startsWith("/subscribe") ||
          pathname.startsWith("/onboarding")
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exercise/:path*",
    "/feedback/:path*",
    "/my-pdf/:path*",
    "/subscribe/:path*",
    "/onboarding/:path*",
  ],
};
