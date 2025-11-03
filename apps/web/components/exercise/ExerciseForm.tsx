"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Keyboard, Mic, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ExerciseType } from "@/types/models";

interface ExerciseFormProps {
  exerciseId: string;
  title: string;
  content: string;
  wordCount: number;
}

const MIN_CHARS = 10;

export function ExerciseForm({ exerciseId, title, content, wordCount }: ExerciseFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showTip, setShowTip] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exerciseMode, setExerciseMode] = useState<"type" | "speak">("type");

  const charCount = userAnswer.length;
  const isValidLength = charCount >= MIN_CHARS;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userAnswer]);

  const handleSubmit = async () => {
    if (!isValidLength) {
      setError(`Please enter at least ${MIN_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/exercises/${exerciseId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer,
          correctAnswer: content,
          timeSpentSeconds: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit exercise");
      }

      if (data.success && data.attemptId) {
        router.push(`/feedback/${data.attemptId}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit exercise. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {showTip && (
        <Alert className="glass">
          <div className="flex items-start justify-between gap-4">
            <AlertDescription className="flex-1">
              <strong>Tip:</strong> Try to type out the translation from memory. This exercise helps
              improve your typing speed and language recall. Aim for accuracy!
            </AlertDescription>
            <button
              onClick={() => setShowTip(false)}
              className="flex-shrink-0 hover:bg-muted rounded-sm p-1 transition-colors"
              aria-label="Dismiss tip"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Button
            variant={exerciseMode === "type" ? "default" : "outline"}
            onClick={() => setExerciseMode("type")}
            className="gap-2"
          >
            <Keyboard className="h-4 w-4" />
            Type
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" disabled className="gap-2 cursor-not-allowed">
                  <Mic className="h-4 w-4" />
                  Speak
                  <Badge variant="secondary" className="text-xs ml-1">
                    Soon
                  </Badge>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Speech recognition coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="user-answer" className="text-sm font-medium">
            Your Translation
          </label>
          <span
            className={`text-sm ${
              isValidLength
                ? "text-muted-foreground"
                : charCount > 0
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {charCount} / {MIN_CHARS} min
          </span>
        </div>
        <Textarea
          ref={textareaRef}
          id="user-answer"
          placeholder="Type your translation here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="min-h-[200px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!isValidLength || isSubmitting}
          size="lg"
          className="sm:flex-1 relative overflow-hidden group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Submit Translation"
          )}
          {isSubmitting && (
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-gradient opacity-20" />
          )}
        </Button>
      </div>
    </div>
  );
}
