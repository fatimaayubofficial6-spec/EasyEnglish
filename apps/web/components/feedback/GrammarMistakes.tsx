"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface GrammarMistake {
  mistake: string;
  correction: string;
  explanation: string;
}

interface GrammarMistakesProps {
  mistakes?: GrammarMistake[];
}

export function GrammarMistakes({ mistakes = [] }: GrammarMistakesProps) {
  if (mistakes.length === 0) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-500" />
            Grammar Analysis
          </CardTitle>
          <CardDescription>No major grammar mistakes found!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Grammar Analysis
        </CardTitle>
        <CardDescription>
          {mistakes.length} area{mistakes.length > 1 ? "s" : ""} for improvement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {mistakes.map((mistake, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-start gap-3 pr-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm font-medium text-orange-500">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{mistake.mistake}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-9 space-y-3 pt-2">
                  <div className="rounded-lg bg-green-500/10 p-3 border border-green-500/20">
                    <p className="text-sm font-medium text-green-500 mb-1">Correction:</p>
                    <p className="text-sm text-foreground">{mistake.correction}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-medium text-foreground mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{mistake.explanation}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
