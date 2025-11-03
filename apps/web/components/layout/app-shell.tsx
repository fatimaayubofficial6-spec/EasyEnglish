import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function AppShell({
  children,
  className,
  showHeader = true,
  showFooter = true,
}: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </div>
  );
}
