# Authentication Implementation

This document describes the authentication system implemented for EasyEnglish.

## Overview

The application uses NextAuth.js v4 with Google OAuth as the sole authentication provider. Sessions are managed using JWT tokens with optional MongoDB adapter for persistent storage.

## Architecture

### Components

1. **NextAuth Configuration** (`lib/auth/config.ts`)
   - Google OAuth provider setup
   - JWT session strategy
   - MongoDB adapter for user persistence
   - Custom callbacks for user handling
   - Custom pages for sign-in and errors

2. **API Routes** (`app/api/auth/[...nextauth]/route.ts`)
   - Handles all NextAuth endpoints
   - GET: Sign in, sign out, session, providers, CSRF token
   - POST: Sign in, sign out, callback

3. **Middleware** (`middleware.ts`)
   - Protects authenticated routes
   - Redirects unauthenticated users to sign-in page
   - Uses NextAuth's withAuth middleware

4. **Helper Functions** (`lib/auth/session.ts`)
   - `getCurrentUser()`: Get current user in Server Components
   - `getSession()`: Get full session in Server Components

5. **Database Client** (`lib/db/mongodb.ts`)
   - MongoDB connection with singleton pattern
   - Falls back gracefully if database not configured
   - Supports both local and MongoDB Atlas

6. **Type Definitions** (`types/next-auth.d.ts`)
   - Extends NextAuth types to include user ID
   - Adds JWT token types

## Protected Routes

The following routes require authentication (configured in `middleware.ts`):

- `/dashboard` - User dashboard
- `/exercise/*` - Exercise pages
- `/feedback/*` - Feedback pages
- `/my-pdf` - PDF management
- `/subscribe` - Subscription management
- `/onboarding` - Initial user setup

## User Flow

### New User Sign-Up

1. User clicks "Sign In" or "Get Started" button
2. Redirected to `/auth/signin`
3. Clicks "Continue with Google"
4. Google OAuth consent screen
5. Google redirects back with authorization code
6. NextAuth creates user account in database
7. User is redirected to onboarding page (`/onboarding`)
8. User selects their native language
9. Redirected to dashboard

### Returning User Sign-In

1. User clicks "Sign In"
2. Redirected to `/auth/signin`
3. Clicks "Continue with Google"
4. Google OAuth (may auto-approve if already signed in to Google)
5. NextAuth verifies user exists
6. User is redirected to dashboard (or callback URL)

### Sign-Out

1. User clicks "Sign Out" button
2. NextAuth clears session
3. User redirected to homepage

## Session Management

- **Strategy**: JWT (JSON Web Tokens)
- **Storage**: Encrypted HTTP-only cookie
- **Lifetime**: 30 days (NextAuth default)
- **Refresh**: Automatic on page load if session is still valid

### Session Data Structure

```typescript
{
  user: {
    id: string;          // User ID from database
    name: string | null;
    email: string | null;
    image: string | null;
  },
  expires: string;       // ISO timestamp
}
```

## Database Schema

When MongoDB is configured, NextAuth automatically creates and manages these collections:

### users
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  emailVerified: Date | null,
  image: string
}
```

### accounts
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "oauth",
  provider: "google",
  providerAccountId: string,
  refresh_token: string,
  access_token: string,
  expires_at: number,
  token_type: "Bearer",
  scope: string,
  id_token: string
}
```

### sessions (optional - only if using database sessions)
```typescript
{
  _id: ObjectId,
  sessionToken: string,
  userId: ObjectId,
  expires: Date
}
```

## Environment Variables

Required environment variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Database (optional)
DATABASE_URL=mongodb://localhost:27017/easyenglish
```

## Security Features

1. **CSRF Protection**: Built into NextAuth
2. **HTTP-Only Cookies**: Session tokens not accessible via JavaScript
3. **Secure Cookies**: HTTPS-only in production
4. **Token Encryption**: JWT tokens are signed and encrypted
5. **OAuth State Parameter**: Prevents CSRF attacks during OAuth flow
6. **Origin Validation**: Checks callback URLs

## Error Handling

Custom error page at `/auth/error` handles various authentication errors:

- `Configuration`: Server configuration issue
- `AccessDenied`: User denied access
- `Verification`: Token expired or invalid
- `OAuthAccountNotLinked`: Email already in use
- `OAuthCallback`: OAuth process failed
- `OAuthCreateAccount`: Account creation failed
- `Callback`: General callback error

## Usage Examples

### Client Component

```tsx
"use client";

import { useSession } from "next-auth/react";

export function ProfileButton() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  
  return <div>Hello, {session.user.name}!</div>;
}
```

### Server Component

```tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### API Route

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  return Response.json({ user: session.user });
}
```

## Testing

### Manual Testing Checklist

- [ ] Sign in with Google works
- [ ] New users are redirected to onboarding
- [ ] Returning users go directly to dashboard
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to sign-in when not authenticated
- [ ] Sign out clears session and redirects to homepage
- [ ] Error page displays appropriate messages
- [ ] Mobile responsive auth pages

### Automated Tests

Run smoke tests with:

```bash
npm run test
```

See `__tests__/auth.test.ts` for test implementation.

## Troubleshooting

### "Configuration" Error

- Check that `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL

### "OAuthCallback" Error

- Verify Google OAuth credentials are correct
- Check that redirect URI is registered in Google Console
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### Database Connection Issues

- If database is not available, the app will fall back to JWT-only mode
- Check `DATABASE_URL` format
- Verify network access to MongoDB instance

### Session Not Persisting

- Clear browser cookies and try again
- Check that `NEXTAUTH_URL` matches the URL you're using
- Verify no browser extensions are blocking cookies

## Future Enhancements

Potential improvements for future iterations:

1. **Multi-provider Support**: Add email/password authentication
2. **Two-Factor Authentication**: Add 2FA option for security
3. **Session Management UI**: Allow users to view/revoke active sessions
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Audit Logging**: Log authentication events for security monitoring
6. **Social Providers**: Add more OAuth providers (GitHub, Facebook, etc.)
7. **User Preferences**: Store user preferences in database
8. **Account Linking**: Allow linking multiple OAuth providers to one account

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Adapter](https://authjs.dev/reference/adapter/mongodb)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
