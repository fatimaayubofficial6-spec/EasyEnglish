"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "framer-motion";
import { BookOpen, Languages, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Read",
    description:
      "Start with engaging content tailored to your level. From articles to stories, immerse yourself in authentic English.",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Languages,
    title: "Translate",
    description:
      "Get instant AI-powered translations and explanations. Understand context, idioms, and cultural nuances in real-time.",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: TrendingUp,
    title: "Learn",
    description:
      "Practice with interactive exercises and track your progress. Master vocabulary, grammar, and pronunciation effectively.",
    color: "from-green-500/20 to-emerald-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <m.h2
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It <span className="gradient-text">Works</span>
          </m.h2>
          <m.p
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our proven three-step method makes learning English natural and effective
          </m.p>
        </div>

        <m.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <m.div key={step.title} variants={itemVariants}>
                <Card className="glass-hover group relative h-full overflow-hidden border-2 transition-all duration-300 hover:scale-105">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <CardHeader className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-5xl font-bold text-muted-foreground/20">
                        {(index + 1).toString().padStart(2, "0")}
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>

                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                      <m.div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent"
                        animate={{
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </m.div>
                    </div>
                  )}
                </Card>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
