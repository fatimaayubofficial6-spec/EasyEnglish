"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "@/lib/db/stats";

interface DashboardHeroProps {
  userName?: string;
  stats: UserStats;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        element.textContent = value.toString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-3xl font-bold">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function DashboardHero({ userName, stats }: DashboardHeroProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {userName || "Learner"}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Keep up the great work learning English
          </p>
        </div>
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-3 border border-orange-500/30">
            <span className="text-4xl animate-pulse">🔥</span>
            <div>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Exercises Completed</CardDescription>
            <CardTitle>
              <AnimatedCounter value={stats.exercisesCompleted} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.totalAttempts} total attempts
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle>
              <AnimatedCounter value={stats.currentStreak} suffix=" days" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Keep practicing daily!
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle>
              <AnimatedCounter value={stats.averageScore} suffix="%" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.averageScore >= 70 ? "Excellent work!" : "Keep improving!"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
