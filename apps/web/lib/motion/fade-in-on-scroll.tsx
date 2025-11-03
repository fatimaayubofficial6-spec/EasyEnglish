"use client";

import { m, MotionProps, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface FadeInOnScrollProps extends Omit<MotionProps, "initial" | "animate"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

export function FadeInOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  ...props
}: FadeInOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
    none: {},
  };

  return (
    <m.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : {
              opacity: 0,
              ...directionOffset[direction],
            }
      }
      transition={{
        duration: 0.5,
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
