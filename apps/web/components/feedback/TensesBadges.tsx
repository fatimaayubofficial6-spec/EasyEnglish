"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface TensesBadgesProps {
  tenses?: string[];
}

export function TensesBadges({ tenses = [] }: TensesBadgesProps) {
  if (tenses.length === 0) {
    return null;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-500" />
          Key Tenses
        </CardTitle>
        <CardDescription>
          Important grammatical tenses used in this exercise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tenses.map((tense, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-purple-500/20"
            >
              {tense}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
