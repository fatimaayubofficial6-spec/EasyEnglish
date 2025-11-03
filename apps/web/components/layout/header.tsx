"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="gradient-text text-2xl font-bold">EasyEnglish</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/lessons"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Lessons
            </Link>
            <Link
              href="/practice"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Practice
            </Link>
            <Link
              href="/progress"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Progress
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
