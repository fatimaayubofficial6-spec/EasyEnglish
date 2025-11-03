import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.next();
    }

    const protectedRoutes = ["/dashboard", "/exercise", "/feedback", "/my-pdf"];
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && token.email) {
      try {
        const subscriptionStatus = token.subscriptionStatus as string | undefined;
        const onboardingCompleted = token.onboardingCompleted as boolean | undefined;

        if (!onboardingCompleted) {
          const url = new URL("/onboarding", req.url);
          return NextResponse.redirect(url);
        }

        if (subscriptionStatus !== "active") {
          const url = new URL("/subscribe", req.url);
          url.searchParams.set("from", pathname);
          return NextResponse.redirect(url);
        }
      } catch (error) {
        console.error("Middleware error:", error);
      }
    }

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
