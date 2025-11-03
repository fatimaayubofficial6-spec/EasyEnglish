"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { m } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden px-4 pt-20 sm:px-6 lg:px-8">
      <div className="container relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center space-y-8 text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-6" variant="outline">
            ✨ AI-Powered Language Learning
          </Badge>
        </m.div>

        <m.h1
          className="gradient-text max-w-4xl text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Master English the{" "}
          <span className="relative inline-block">
            Easy Way
            <m.span
              className="absolute -bottom-2 left-0 h-3 w-full bg-gradient-to-r from-primary/30 to-accent/30 blur-lg"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </span>
        </m.h1>

        <m.p
          className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transform your English learning journey with AI-powered lessons, real-time feedback, and
          personalized practice. Join thousands of learners worldwide.
        </m.p>

        <m.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button size="lg" className="group" asChild>
            <Link href="/auth/signin">
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="group" asChild>
            <Link href="#how-it-works">
              <Play className="mr-2 h-4 w-4" />
              See How It Works
            </Link>
          </Button>
        </m.div>

        <m.div
          className="relative mt-12 w-full max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="glass-hover relative aspect-video overflow-hidden rounded-2xl border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="flex h-full items-center justify-center">
                <m.div
                  className="rounded-full bg-background/80 p-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-12 w-12 text-primary" />
                </m.div>
              </div>
            </div>
            <m.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="absolute -inset-x-20 -inset-y-10 -z-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-3xl" />
        </m.div>
      </div>
    </section>
  );
}
