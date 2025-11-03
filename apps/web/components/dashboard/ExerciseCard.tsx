"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "@/types/models";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";

interface ExerciseCardProps {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  topics: string[];
  estimatedMinutes: number;
  attempted: boolean;
  completed: boolean;
  bestScore: number;
}

function getDifficultyColor(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case DifficultyLevel.BEGINNER:
      return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
    case DifficultyLevel.INTERMEDIATE:
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
    case DifficultyLevel.ADVANCED:
      return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30";
  }
}

export function ExerciseCard({
  id,
  title,
  difficulty,
  topics,
  estimatedMinutes,
  attempted,
  completed,
  bestScore,
}: ExerciseCardProps) {
  return (
    <Card className="glass group hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Badge className={getDifficultyColor(difficulty)} variant="outline">
                  {difficulty}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {estimatedMinutes} min
                </Badge>
              </div>
            </CardDescription>
          </div>
          {completed && (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs capitalize">
                {topic}
              </Badge>
            ))}
            {topics.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {attempted && !completed && (
          <div className="text-xs text-muted-foreground">
            Best score: {bestScore}% - Try again to complete!
          </div>
        )}

        <Link href={`/exercise/${id}`} className="block">
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {completed ? "Review Exercise" : attempted ? "Continue" : "Start Exercise"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
