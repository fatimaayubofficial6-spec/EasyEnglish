"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, TrendingUp, Lightbulb } from "lucide-react";

interface FeedbackSummaryProps {
  strengths?: string[];
  improvements?: string[];
  suggestions?: string[];
  overallFeedback?: string;
}

export function FeedbackSummary({
  strengths = [],
  improvements = [],
  suggestions = [],
  overallFeedback,
}: FeedbackSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Overall Feedback */}
      {overallFeedback && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Overall Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-foreground/90">{overallFeedback}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Strengths */}
        {strengths.length > 0 && (
          <Card className="glass border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <ThumbsUp className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="flex-1">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {improvements.length > 0 && (
          <Card className="glass border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <TrendingUp className="h-5 w-5" />
                Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="flex-1">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card className="glass border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-500">
                <Lightbulb className="h-5 w-5" />
                Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-1">→</span>
                    <span className="flex-1">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
