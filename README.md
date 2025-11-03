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

### Additional Services

See `.env.example` for additional configuration options for:

- Database
- AWS S3
- Stripe
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
