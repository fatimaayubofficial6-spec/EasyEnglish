"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

interface KeyVocabularyProps {
  vocabulary?: VocabularyItem[];
}

export function KeyVocabulary({ vocabulary = [] }: KeyVocabularyProps) {
  if (vocabulary.length === 0) {
    return null;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Key Vocabulary
        </CardTitle>
        <CardDescription>
          Important words and phrases from this exercise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {vocabulary.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-2"
            >
              <h4 className="font-semibold text-lg text-yellow-500">{item.word}</h4>
              <p className="text-sm text-muted-foreground">{item.definition}</p>
              <div className="pt-2 border-t border-border/30">
                <p className="text-sm italic text-foreground/80">
                  &ldquo;{item.example}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
