"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
  { href: "/lessons", label: "Lessons" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <header className="glass sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="focus-ring flex items-center space-x-2 rounded">
              <span className="gradient-text text-2xl font-bold">EasyEnglish</span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="focus-ring rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 md:flex">
              {isLoading ? (
                <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
              ) : session ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signin">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <m.nav
              className="glass border-t border-border/40 md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Mobile navigation"
            >
              <div className="container mx-auto space-y-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="focus-ring block rounded px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
                  {isLoading ? (
                    <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                  ) : session ? (
                    <>
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </m.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
