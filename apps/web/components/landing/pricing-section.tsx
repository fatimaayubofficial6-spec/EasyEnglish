"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { m } from "framer-motion";
import { Check, Sparkles, Shield, Award } from "lucide-react";
import Link from "next/link";

const features = [
  "Unlimited AI-powered lessons",
  "Real-time grammar & pronunciation feedback",
  "Personalized learning path",
  "Interactive vocabulary builder",
  "Progress tracking & analytics",
  "Mobile app access (iOS & Android)",
  "Downloadable lesson materials",
  "24/7 AI tutor support",
  "Certificate of completion",
];

const trustLogos = [
  { name: "Google", initial: "G" },
  { name: "Microsoft", initial: "M" },
  { name: "Amazon", initial: "A" },
  { name: "Apple", initial: "A" },
];

export function PricingSection() {
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
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </m.h2>
          <m.p
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Start learning for free. Upgrade anytime for unlimited access to all features.
          </m.p>
        </div>

        <m.div
          className="mx-auto max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass relative overflow-hidden border-2 border-primary/50">
            <div className="absolute right-0 top-0">
              <Badge className="rounded-bl-lg rounded-tr-lg border-0 bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-semibold">
                Most Popular
              </Badge>
            </div>

            <CardHeader className="space-y-4 pb-8 pt-8">
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Premium Plan</CardTitle>
                  <CardDescription>Everything you need to master English</CardDescription>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="gradient-text text-5xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <p className="text-sm text-muted-foreground">
                7-day free trial • Cancel anytime • No hidden fees
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="group relative w-full overflow-hidden" asChild>
                  <Link href="/auth/signin">
                    <m.span
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                      animate={{
                        x: ["0%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      Start Free Trial
                      <Sparkles className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </m.div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">What&apos;s included:</p>
                {features.map((feature, index) => (
                  <m.div
                    key={feature}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </m.div>
                ))}
              </div>

              <div className="space-y-4 border-t border-border/50 pt-6">
                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                  <Shield className="h-5 w-5 shrink-0 text-green-500" />
                  <div className="text-sm">
                    <span className="font-semibold">30-Day Money-Back Guarantee</span>
                    <p className="text-xs text-muted-foreground">
                      Not satisfied? Get a full refund, no questions asked
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4">
                  <Award className="h-5 w-5 shrink-0 text-blue-500" />
                  <div className="text-sm">
                    <span className="font-semibold">Certified Course</span>
                    <p className="text-xs text-muted-foreground">
                      Earn a recognized certificate upon completion
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <p className="mb-4 text-center text-xs font-semibold text-muted-foreground">
                  Trusted by employees at:
                </p>
                <div className="flex items-center justify-center gap-4">
                  {trustLogos.map((logo) => (
                    <div
                      key={logo.name}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80"
                      title={logo.name}
                    >
                      <span className="text-lg font-bold text-muted-foreground">
                        {logo.initial}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <div className="absolute -inset-x-20 -inset-y-10 -z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-50 blur-3xl" />
          </Card>
        </m.div>
      </div>
    </section>
  );
}
