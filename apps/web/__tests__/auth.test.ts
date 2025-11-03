/**
 * Authentication Smoke Tests
 * 
 * These tests verify the basic structure and exports of the authentication system.
 * Run with: npm run test (when test runner is configured)
 * 
 * For manual testing:
 * 1. Start the dev server: npm run dev
 * 2. Navigate to http://localhost:3000
 * 3. Click "Sign In" or "Get Started"
 * 4. Sign in with Google (requires valid credentials)
 * 5. Verify redirect to dashboard or onboarding
 * 6. Click "Sign Out" and verify redirect to homepage
 */

// Verify auth route exports
export async function testAuthRouteExists() {
  try {
    const authRoute = await import("@/app/api/auth/[...nextauth]/route");
    
    if (!authRoute.GET || !authRoute.POST) {
      throw new Error("Auth route missing GET or POST handlers");
    }
    
    console.log("✓ Auth API route exports are valid");
    return true;
  } catch (error) {
    console.error("✗ Auth API route test failed:", error);
    return false;
  }
}

// Verify auth configuration
export async function testAuthConfig() {
  try {
    const { authOptions } = await import("@/lib/auth/config");
    
    if (!authOptions || !authOptions.providers || !Array.isArray(authOptions.providers)) {
      throw new Error("Invalid auth options configuration");
    }
    
    const googleProvider = authOptions.providers.find((p: any) => p.id === "google");
    if (!googleProvider) {
      throw new Error("Google provider not configured");
    }
    
    if (authOptions.session?.strategy !== "jwt") {
      throw new Error("Session strategy should be JWT");
    }
    
    if (authOptions.pages?.signIn !== "/auth/signin") {
      throw new Error("Custom sign-in page not configured");
    }
    
    console.log("✓ Auth configuration is valid");
    return true;
  } catch (error) {
    console.error("✗ Auth configuration test failed:", error);
    return false;
  }
}

// Verify helper functions
export async function testAuthHelpers() {
  try {
    const { getCurrentUser, getSession } = await import("@/lib/auth/session");
    
    if (typeof getCurrentUser !== "function") {
      throw new Error("getCurrentUser is not a function");
    }
    
    if (typeof getSession !== "function") {
      throw new Error("getSession is not a function");
    }
    
    console.log("✓ Auth helper functions are valid");
    return true;
  } catch (error) {
    console.error("✗ Auth helpers test failed:", error);
    return false;
  }
}

// Run all tests
export async function runAuthTests() {
  console.log("Running authentication smoke tests...\n");
  
  const results = await Promise.all([
    testAuthRouteExists(),
    testAuthConfig(),
    testAuthHelpers(),
  ]);
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`\n${passed}/${total} tests passed`);
  
  return passed === total;
}

// Auto-run if executed directly
if (require.main === module) {
  runAuthTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
