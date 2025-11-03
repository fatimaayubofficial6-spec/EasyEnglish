import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function MainContent({ children, className, containerClassName }: MainContentProps) {
  return (
    <main className={cn("flex-1", className)}>
      <div className={cn("container mx-auto px-4 py-8 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </main>
  );
}
