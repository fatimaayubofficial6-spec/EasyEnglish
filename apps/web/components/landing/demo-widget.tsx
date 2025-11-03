"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { m, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Check, BookOpen } from "lucide-react";
import { useState } from "react";

const demoResponses = [
  {
    text: "I am learning English",
    feedback: [
      { type: "grammar", message: "Perfect sentence structure!", icon: Check },
      {
        type: "vocabulary",
        message: "Consider using 'studying' for formal contexts",
        icon: BookOpen,
      },
      { type: "suggestion", message: "Try: 'I am currently learning English'", icon: Sparkles },
    ],
  },
  {
    text: "She go to school yesterday",
    feedback: [
      {
        type: "grammar",
        message: "Verb tense error: Use 'went' (past tense) instead of 'go'",
        icon: Check,
      },
      {
        type: "suggestion",
        message: "Correct: 'She went to school yesterday'",
        icon: Sparkles,
      },
    ],
  },
  {
    text: "The weather is nice today",
    feedback: [
      { type: "grammar", message: "Excellent! No errors found.", icon: Check },
      {
        type: "vocabulary",
        message: "Alternative words: beautiful, pleasant, lovely",
        icon: BookOpen,
      },
    ],
  },
];

export function DemoWidget() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<(typeof demoResponses)[0]["feedback"] | null>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setFeedback(null);

    setTimeout(() => {
      const matchedDemo = demoResponses.find((demo) =>
        inputText.toLowerCase().includes(demo.text.toLowerCase().split(" ")[0])
      );
      setFeedback(matchedDemo?.feedback || demoResponses[0].feedback);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <section id="demo" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <m.h2
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Try It <span className="gradient-text">Yourself</span>
          </m.h2>
          <m.p
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience our AI-powered feedback in action. Type any English sentence to see instant
            analysis and suggestions.
          </m.p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-hover border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Writing Assistant
              </CardTitle>
              <CardDescription>
                Write a sentence in English and get instant feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your English sentence here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="glass text-base"
                  disabled={isAnalyzing}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim() || isAnalyzing}
                  size="icon"
                  className="shrink-0"
                >
                  {isAnalyzing ? (
                    <m.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </m.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {isAnalyzing && (
                  <m.div
                    key="analyzing"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="glass h-16 animate-pulse rounded-lg"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </m.div>
                )}

                {!isAnalyzing && feedback && (
                  <m.div
                    key="feedback"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {feedback.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <m.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="glass-hover flex gap-3 rounded-lg border p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <p className="text-sm leading-relaxed">{item.message}</p>
                          </div>
                        </m.div>
                      );
                    })}
                  </m.div>
                )}
              </AnimatePresence>

              {!feedback && !isAnalyzing && (
                <div className="rounded-lg border border-dashed border-border/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Enter a sentence above to see AI-powered feedback
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {demoResponses.map((demo) => (
                      <Button
                        key={demo.text}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(demo.text)}
                        className="text-xs"
                      >
                        Try: &quot;{demo.text}&quot;
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </m.div>
      </div>
    </section>
  );
}
