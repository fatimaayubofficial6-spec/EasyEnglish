"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

const languages = [
  { name: "Hello", lang: "English", position: { top: "20%", left: "50%" } },
  { name: "Hola", lang: "Spanish", position: { top: "40%", left: "30%" } },
  { name: "Bonjour", lang: "French", position: { top: "30%", left: "70%" } },
  { name: "こんにちは", lang: "Japanese", position: { top: "60%", left: "80%" } },
  { name: "你好", lang: "Chinese", position: { top: "50%", left: "20%" } },
  { name: "Olá", lang: "Portuguese", position: { top: "70%", left: "50%" } },
  { name: "Привет", lang: "Russian", position: { top: "15%", left: "75%" } },
  { name: "مرحبا", lang: "Arabic", position: { top: "45%", left: "60%" } },
];

export function GlobeSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <m.h2
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Connect with <span className="gradient-text">Learners Worldwide</span>
          </m.h2>
          <m.p
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join a global community of language learners. Practice with speakers from around the
            world and accelerate your progress.
          </m.p>
        </div>

        <div className="relative flex items-center justify-center">
          <m.div
            className="relative h-[400px] w-[400px] md:h-[500px] md:w-[500px]"
            onHoverStart={() => !prefersReducedMotion && setIsPaused(true)}
            onHoverEnd={() => !prefersReducedMotion && setIsPaused(false)}
          >
            <m.div
              className="relative h-full w-full"
              animate={
                prefersReducedMotion || isPaused
                  ? {}
                  : {
                      rotateY: 360,
                    }
              }
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="glass absolute inset-0 rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.05),transparent_50%)]" />

                <svg
                  className="absolute inset-0 h-full w-full opacity-20"
                  viewBox="0 0 400 400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  {[...Array(8)].map((_, i) => (
                    <ellipse
                      key={`lat-${i}`}
                      cx="200"
                      cy="200"
                      rx="180"
                      ry={20 + i * 20}
                      fill="none"
                      stroke="url(#globeGradient)"
                      strokeWidth="1"
                    />
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <ellipse
                      key={`lon-${i}`}
                      cx="200"
                      cy="200"
                      rx={20 + i * 20}
                      ry="180"
                      fill="none"
                      stroke="url(#globeGradient)"
                      strokeWidth="1"
                      transform={`rotate(${i * 22.5} 200 200)`}
                    />
                  ))}
                </svg>
              </div>

              {languages.map((item, index) => (
                <m.div
                  key={item.name}
                  className="glass-hover absolute rounded-lg border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-md"
                  style={{
                    top: item.position.top,
                    left: item.position.left,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  <div className="gradient-text font-semibold">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground">{item.lang}</div>
                </m.div>
              ))}
            </m.div>

            <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-3xl" />
          </m.div>
        </div>

        <m.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            {prefersReducedMotion ? "Globe animation paused" : "Hover to pause rotation"}
          </p>
        </m.div>
      </div>
    </section>
  );
}
