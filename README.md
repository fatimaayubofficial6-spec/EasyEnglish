# EasyEnglish Monorepo

A modern monorepo for the EasyEnglish platform - an interactive English learning application built with Next.js 14, TypeScript, and modern web technologies.

## 🏗️ Project Structure

```
easyenglish-monorepo/
├── apps/
│   └── web/                 # Next.js 14 web application
│       ├── app/            # App Router pages and layouts
│       ├── components/     # React components
│       ├── lib/            # Utility functions and helpers
│       └── styles/         # Additional styles
├── packages/               # Shared packages (future)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 9.x or later

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd easyenglish-monorepo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local` and configure the required environment variables.

### Development

To start the development server:

```bash
npm run dev
```

This will start the Next.js development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production:

```bash
npm run build
```

To run the production build:

```bash
npm run start
```

## 🛠️ Available Scripts

### Root Level

- `npm run dev` - Start the web app in development mode
- `npm run build` - Build the web app for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint on the web app
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without making changes

### Web App (`apps/web`)

- `npm run dev --workspace=apps/web` - Start development server
- `npm run build --workspace=apps/web` - Build for production
- `npm run lint --workspace=apps/web` - Run ESLint
- `npm run format --workspace=apps/web` - Format files

## 📦 Tech Stack

### Core

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

### UI & Styling

- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Headless UI](https://headlessui.com/)** - Unstyled accessible components

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting (with accessibility rules)
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

## 🎨 Code Style

This project uses:

- **ESLint** for code quality and consistency
- **Prettier** for code formatting
- **TypeScript** for type safety
- **jsx-a11y** for accessibility linting

To ensure your code follows the project standards:

```bash
npm run lint        # Check for linting errors
npm run format      # Auto-format code
```

## 📁 Path Aliases

TypeScript path aliases are configured for cleaner imports:

```typescript
import { Button } from "@/components/Button";
import { utils } from "@/lib/utils";
```

Available aliases:

- `@/*` - Maps to the root of the `apps/web` directory

## 🌍 Environment Variables

Copy `.env.example` to `.env.local` in `apps/web` and configure:

### Required for Development

- `NODE_ENV` - Environment mode (development/production)
- `NEXT_PUBLIC_APP_URL` - Public app URL

### Authentication (NextAuth)

- `NEXTAUTH_URL` - Base URL for NextAuth
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate with: `openssl rand -base64 32`)

### Database (MongoDB)

- `DATABASE_URL` - MongoDB connection string

#### Local MongoDB Setup (Docker)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then set: `DATABASE_URL=mongodb://localhost:27017/easyenglish`

#### MongoDB Atlas (Recommended for Production)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Add your IP address to the IP Access List
3. Create a database user with read/write permissions
4. Get your connection string and replace placeholders

### Google OAuth

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

Get credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Stripe Configuration

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `STRIPE_PRICE_ID` - Your subscription price ID

#### Stripe Setup

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Create a product and price in the [Products section](https://dashboard.stripe.com/test/products)
4. Copy the Price ID (starts with `price_`) to `STRIPE_PRICE_ID`

#### Local Webhook Testing with Stripe CLI

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# Windows
scoop install stripe
```

Login and forward webhooks to your local server:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will output a webhook signing secret (starts with `whsec_`). Copy this to `STRIPE_WEBHOOK_SECRET`.

Keep the CLI running while developing to receive webhook events.

### Additional Services

See `.env.example` for additional configuration options for:

- AWS S3
- OpenAI/AI services

## 🎯 Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Dark mode support with next-themes
- ✅ ESLint with accessibility rules
- ✅ Prettier for code formatting
- ✅ Path aliases configured
- ✅ Monorepo structure ready
- ✅ Google OAuth authentication
- ✅ MongoDB with Mongoose ODM
- ✅ Stripe subscription integration
- ✅ Protected routes with middleware
- ✅ Subscription status validation

## 📝 Development Guidelines

### Component Structure

Create components in `apps/web/components/`:

```typescript
// components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-600 rounded">
      {children}
    </button>
  );
}
```

### Using Path Aliases

```typescript
// ✅ Good
import { Button } from "@/components/Button";
import { formatDate } from "@/lib/utils";

// ❌ Avoid
import { Button } from "../../components/Button";
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting: `npm run lint && npm run format`
4. Commit your changes
5. Push and create a pull request

## 📄 License

[Add your license here]

## 🆘 Support

For issues and questions, please open an issue in the repository.
