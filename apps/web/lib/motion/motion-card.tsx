"use client";

import { m, MotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MotionCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionCard({ children, className, delay = 0, ...props }: MotionCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </m.div>
  );
}
