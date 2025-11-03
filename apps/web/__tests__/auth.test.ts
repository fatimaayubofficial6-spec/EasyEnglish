/**
 * Authentication Smoke Tests
 *
 * These tests verify the basic structure and exports of the authentication system.
 */

describe("Authentication System", () => {
  it("should export auth API route handlers", async () => {
    const authRoute = await import("@/app/api/auth/[...nextauth]/route");

    expect(authRoute.GET).toBeDefined();
    expect(authRoute.POST).toBeDefined();
  });

  it("should have valid auth configuration", async () => {
    const { authOptions } = await import("@/lib/auth/config");

    expect(authOptions).toBeDefined();
    expect(authOptions.providers).toBeDefined();
    expect(Array.isArray(authOptions.providers)).toBe(true);

    const googleProvider = authOptions.providers.find((p: any) => p.id === "google");
    expect(googleProvider).toBeDefined();

    expect(authOptions.session?.strategy).toBe("jwt");
    expect(authOptions.pages?.signIn).toBe("/auth/signin");
  });

  it("should export auth helper functions", async () => {
    const { getCurrentUser, getSession } = await import("@/lib/auth/session");

    expect(typeof getCurrentUser).toBe("function");
    expect(typeof getSession).toBe("function");
  });
});
