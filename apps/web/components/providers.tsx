"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <LazyMotion features={domAnimation}>{children}</LazyMotion>
      </ThemeProvider>
    </SessionProvider>
  );
}
