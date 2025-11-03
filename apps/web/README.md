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

### Setting Up MongoDB

The application uses MongoDB with Mongoose for data persistence. You have two options:

#### Option 1: Local MongoDB (via Docker)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then set in `.env.local`:
```env
DATABASE_URL=mongodb://localhost:27017/easyenglish
```

#### Option 2: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (free tier available)
3. Add your IP address to the IP Access List
4. Create a database user with read/write permissions
5. Get your connection string and add to `.env.local`:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/easyenglish?retryWrites=true&w=majority
```

### Seeding the Database

After setting up MongoDB, seed it with sample data:

```bash
npm run db:seed
```

This will create:
- Sample paragraphs for exercises (various difficulty levels)
- Example content in English and Spanish

**Note**: To create an admin user, you need to:
1. Sign in to the application first
2. Find your user ID in the MongoDB `users` collection
3. Update the `sampleAdminUserId` in `scripts/seed.ts`
4. Run `npm run db:seed` again

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
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run db:seed` - Seed database with sample data

## Testing

Run the application in development mode and test the authentication flow:

1. Navigate to the homepage
2. Click "Sign In" or "Get Started"
3. Sign in with Google
4. Complete the onboarding flow (language selection)
5. Access the dashboard
6. Sign out and verify session is cleared

## Database

The application uses MongoDB with Mongoose for data persistence and schema validation.

### MongoDB Collections

The application uses the following collections:

**Authentication (managed by NextAuth MongoDB adapter):**
- `users` - User profiles
- `accounts` - OAuth account information
- `sessions` - User sessions (if using database sessions)

**Application Data (managed by Mongoose models):**
- `users` - Extended user data with subscription info, language preferences
- `paragraphs` - Exercise content with difficulty levels and metadata
- `translationcaches` - Cached translations to reduce API calls
- `exerciseattempts` - User exercise submissions and scores
- `adminusers` - Admin roles and permissions

### Data Models

#### User Model
- Email (unique, required)
- Google ID (unique, sparse)
- Native and learning languages
- Subscription tier and status
- Onboarding completion status

#### Paragraph Model
- Title and content
- Difficulty level (beginner, intermediate, advanced)
- Language and topics
- Auto-calculated word count
- Active/inactive status

#### TranslationCache Model
- Source text and translation
- Source and target languages
- Provider (e.g., OpenAI)
- Expiration date (30-day TTL)
- Compound unique index on (text, sourceLang, targetLang)

#### ExerciseAttempt Model
- User and paragraph references
- Exercise type (translation, gap_fill, rewrite, comprehension)
- User answer and correct answer
- Score (0-100)
- AI-generated feedback and analysis
- Time spent tracking

#### AdminUser Model
- User reference
- Role (super_admin, admin, moderator)
- Permissions array
- Active status

### Helper Functions

The application provides helper functions in `lib/db/helpers.ts`:

**User Operations:**
- `getUserById()`, `getUserByEmail()`, `getUserByGoogleId()`
- `updateUserSubscription()`, `updateUserOnboarding()`

**Paragraph Operations:**
- `getActiveParagraphs()`, `getParagraphById()`
- `createParagraph()`, `updateParagraph()`, `deactivateParagraph()`

**Translation Cache:**
- `getCachedTranslation()`, `setCachedTranslation()`

**Exercise Attempts:**
- `createExerciseAttempt()`, `getUserExerciseAttempts()`
- `getUserExerciseStats()`

**Admin Operations:**
- `isUserAdmin()`, `getAdminUser()`
- `createAdminUser()`, `updateAdminUser()`, `deactivateAdminUser()`
- `getAllAdmins()`

## PDF Textbook Generation

The application automatically generates personalized PDF textbooks for users, containing all their completed lessons with feedback, corrections, and vocabulary.

### How It Works

1. **Automatic Generation**: After each exercise submission, a background job generates a new lesson page
2. **PDF Merging**: New lessons are merged with existing PDF using `pdf-lib`
3. **Cloud Storage**: PDFs are stored in AWS S3 with private ACL
4. **Secure Downloads**: Users get signed URLs valid for 1 hour

### Required Dependencies

The PDF pipeline requires:
- **Puppeteer**: Headless Chrome for HTML-to-PDF conversion
- **pdf-lib**: PDF manipulation and merging
- **AWS SDK**: S3 storage and signed URL generation

#### Installing Chromium for Puppeteer

Puppeteer downloads Chromium automatically during `npm install`. On some systems (especially Linux), you may need additional dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils

# Alpine Linux (for Docker)
apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont
```

For serverless environments (Vercel, AWS Lambda), use `@sparticuz/chromium` or deploy a custom Docker image with Chromium.

### Setting Up AWS S3

1. **Create an S3 Bucket**:
   ```bash
   # Via AWS CLI
   aws s3api create-bucket --bucket easyenglish-pdfs --region us-east-1
   ```

2. **Create IAM User with S3 Permissions**:
   - Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Create a new user with programmatic access
   - Attach policy with `s3:PutObject` and `s3:GetObject` permissions
   - Save the Access Key ID and Secret Access Key

3. **Configure Environment Variables**:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_S3_BUCKET=easyenglish-pdfs
   ```

### Alternative: Cloudflare R2

Cloudflare R2 is S3-compatible and more cost-effective:

1. Create an R2 bucket at [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Generate API tokens with read/write permissions
3. Use the same environment variables (R2 is S3-compatible)

### PDF Template

The PDF template is located at `templates/pdfLesson.tsx` and generates styled HTML for each lesson. The template includes:
- Lesson metadata (number, date, score, difficulty)
- Original text and user translation
- Side-by-side comparison with corrected version
- Grammar mistakes with explanations
- Key vocabulary with definitions and examples
- Grammar tenses used
- Personalized feedback (strengths, improvements, suggestions)

To customize the template, edit the HTML and inline styles in `templates/pdfLesson.tsx`.

### API Routes

- `POST /api/pdf/generate` - Trigger PDF generation for a user/attempt
- `GET /api/pdf/download` - Generate signed download URL (requires auth)

### Graceful Degradation

If AWS credentials are not configured, the application will:
- Log warnings but continue to function
- Skip PDF generation without failing exercise submissions
- Show appropriate messages on the `/my-pdf` page

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
