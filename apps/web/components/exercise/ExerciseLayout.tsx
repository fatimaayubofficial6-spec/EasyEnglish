"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { DifficultyLevel } from "@/types/models";
import { ExerciseForm } from "./ExerciseForm";

interface ExerciseLayoutProps {
  exerciseId: string;
  title: string;
  difficulty: DifficultyLevel;
  topics: string[];
  estimatedMinutes: number;
  content: string;
  wordCount: number;
  translation?: string;
  translationLanguage?: string;
  translationError?: string;
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

export function ExerciseLayout({
  exerciseId,
  title,
  difficulty,
  topics,
  estimatedMinutes,
  content,
  wordCount,
  translation,
  translationLanguage,
  translationError,
}: ExerciseLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={getDifficultyColor(difficulty)} variant="outline">
          {difficulty}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          {estimatedMinutes} min
        </Badge>
        {topics.slice(0, 3).map((topic) => (
          <Badge key={topic} variant="secondary" className="capitalize">
            {topic}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass h-fit">
          <CardHeader>
            <CardTitle className="text-lg">
              {translationLanguage ? "In Your Language" : "Original Text"}
            </CardTitle>
            <CardDescription>
              {translationError
                ? "Translation unavailable"
                : translationLanguage
                  ? "Read and understand before typing"
                  : "Original English text"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {translationError ? (
              <div className="text-muted-foreground">
                <p className="mb-4 italic">{translationError}</p>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            ) : translation ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap">{translation}</p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Type in English</CardTitle>
            <CardDescription>Translate the text as accurately as you can</CardDescription>
          </CardHeader>
          <CardContent>
            <ExerciseForm
              exerciseId={exerciseId}
              title={title}
              content={content}
              wordCount={wordCount}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
