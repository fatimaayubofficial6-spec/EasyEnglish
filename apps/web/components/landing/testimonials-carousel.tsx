"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Maria Rodriguez",
    role: "Student from Spain",
    content:
      "EasyEnglish transformed my learning experience. The AI feedback is incredibly accurate and helped me improve my grammar in just 3 months!",
    rating: 5,
    avatar: "M",
  },
  {
    name: "Takeshi Yamamoto",
    role: "Business Professional from Japan",
    content:
      "The personalized lessons fit perfectly into my busy schedule. I can practice during my commute and the progress tracking keeps me motivated.",
    rating: 5,
    avatar: "T",
  },
  {
    name: "Sophie Chen",
    role: "University Student from China",
    content:
      "Best language learning platform I've used! The interactive exercises and real-time translations make studying fun and effective.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Ahmed Hassan",
    role: "Engineer from Egypt",
    content:
      "The pronunciation practice and vocabulary builder are game-changers. I feel more confident speaking English at work now.",
    rating: 5,
    avatar: "A",
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

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
            Loved by <span className="gradient-text">Learners Worldwide</span>
          </m.h2>
          <m.p
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of satisfied students who have transformed their English skills
          </m.p>
        </div>

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="relative min-h-[300px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <m.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <Card className="glass-hover h-full border-2">
                  <CardContent className="flex h-full flex-col justify-between p-8">
                    <div className="space-y-6">
                      <div className="flex gap-1">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>

                      <blockquote className="text-lg leading-relaxed">
                        &quot;{testimonials[currentIndex].content}&quot;
                      </blockquote>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white">
                        {testimonials[currentIndex].avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonials[currentIndex].name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </m.div>
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="glass-hover absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="glass-hover absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-border/70"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground" aria-live="polite">
            {isPaused ? "Carousel paused" : "Auto-playing (hover to pause)"}
          </p>
        </div>
      </div>
    </section>
  );
}
