"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </ThemeProvider>
  );
}
