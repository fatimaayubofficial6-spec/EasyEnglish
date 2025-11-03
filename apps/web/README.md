# EasyEnglish - AI-Powered English Learning Platform

This is a [Next.js](https://nextjs.org) project built with the App Router, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas) for production use
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment variables template:

```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here-change-in-production
# Generate a secret with: openssl rand -base64 32

# Google OAuth Configuration
# Get credentials from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (MongoDB for NextAuth adapter)
# If not provided, sessions will use JWT strategy
DATABASE_URL=mongodb://localhost:27017/easyenglish
# or MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/easyenglish
```

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env.local` file

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Authentication

The application uses NextAuth.js v4 with Google OAuth as the sole authentication provider.

### Key Features

- **Google Sign-In**: Users authenticate via Google OAuth
- **Protected Routes**: Automatic redirect for unauthenticated users accessing protected pages
- **Session Management**: JWT-based sessions with MongoDB adapter support
- **Onboarding Flow**: New users are guided through language selection
- **Profile Data**: Stores user name, email, profile picture, and Google ID

### Protected Routes

The following routes require authentication:
- `/dashboard` - User dashboard
- `/exercise/*` - Exercise pages
- `/feedback/*` - Feedback pages
- `/my-pdf` - PDF management
- `/subscribe` - Subscription management
- `/onboarding` - Initial user setup

### Using Authentication in Your Code

#### Client Components

```tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <button onClick={() => signIn("google")}>Sign In</button>;
  }
  
  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

#### Server Components

```tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

#### API Routes

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return NextResponse.json({ user: session.user });
}
```

### Helper Functions

- `useSession()` - React hook for client-side session access
- `getCurrentUser()` - Server-side function to get current user
- `getSession()` - Server-side function to get full session
- `signIn()` - Initiate sign-in flow
- `signOut()` - Sign out the current user

## Project Structure

```
apps/web/
├── app/                      # Next.js App Router pages
│   ├── api/auth/            # NextAuth API routes
│   ├── auth/                # Authentication pages (signin, error)
│   ├── dashboard/           # Protected dashboard
│   ├── onboarding/          # New user onboarding
│   └── ...
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components (Header, Footer, etc.)
│   └── landing/             # Landing page sections
├── lib/                     # Utility functions and configuration
│   ├── auth/                # NextAuth configuration and helpers
│   └── db/                  # Database configuration
├── types/                   # TypeScript type definitions
└── middleware.ts            # NextAuth middleware for route protection
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Testing

Run the application in development mode and test the authentication flow:

1. Navigate to the homepage
2. Click "Sign In" or "Get Started"
3. Sign in with Google
4. Complete the onboarding flow (language selection)
5. Access the dashboard
6. Sign out and verify session is cleared

## Database

The application uses MongoDB with the NextAuth MongoDB adapter for persistent session storage. If `DATABASE_URL` is not provided, the application will fall back to JWT sessions without database persistence.

### MongoDB Collections

NextAuth automatically creates the following collections:
- `users` - User profiles
- `accounts` - OAuth account information
- `sessions` - User sessions (if using database sessions)

## Environment Variables

See `.env.example` for a complete list of required environment variables.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in [Vercel](https://vercel.com/new)
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Important: Update OAuth Callback URLs

When deploying to production, update your Google OAuth settings:
- Authorized JavaScript origins: Add your production domain
- Authorized redirect URIs: Add `https://your-domain.com/api/auth/callback/google`

Also update these environment variables:
- `NEXTAUTH_URL` to your production URL
- `NEXTAUTH_SECRET` to a new secure random string
