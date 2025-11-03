"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

interface FeedbackErrorProps {
  error?: string;
  paragraphId?: string;
  onRetry?: () => void;
}

export function FeedbackError({
  error = "Unable to load feedback",
  paragraphId,
  onRetry,
}: FeedbackErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="glass max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription className="text-base">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button onClick={onRetry} variant="default" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            {paragraphId && (
              <Link href={`/exercise/${paragraphId}`}>
                <Button variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry Exercise
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
