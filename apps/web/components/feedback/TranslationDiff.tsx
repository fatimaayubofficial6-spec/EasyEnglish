"use client";

import ReactDiffViewer from "react-diff-viewer-continued";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TranslationDiffProps {
  userAnswer: string;
  correctedVersion?: string;
}

export function TranslationDiff({ userAnswer, correctedVersion }: TranslationDiffProps) {
  if (!correctedVersion) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle>Your Translation</CardTitle>
          <CardDescription>No corrections needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{userAnswer}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Translation Comparison</CardTitle>
        <CardDescription>
          Your translation (left) vs corrected version (right)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ReactDiffViewer
            oldValue={userAnswer}
            newValue={correctedVersion}
            splitView={true}
            showDiffOnly={false}
            useDarkTheme={true}
            leftTitle="Your Translation"
            rightTitle="Corrected Version"
            styles={{
              variables: {
                dark: {
                  diffViewerBackground: "transparent",
                  addedBackground: "hsl(142.1 76.2% 36.3% / 0.2)",
                  addedColor: "hsl(142.1 70.6% 45.3%)",
                  removedBackground: "hsl(0 84.2% 60.2% / 0.2)",
                  removedColor: "hsl(0 72.2% 50.6%)",
                  wordAddedBackground: "hsl(142.1 76.2% 36.3% / 0.3)",
                  wordRemovedBackground: "hsl(0 84.2% 60.2% / 0.3)",
                  addedGutterBackground: "hsl(142.1 76.2% 36.3% / 0.2)",
                  removedGutterBackground: "hsl(0 84.2% 60.2% / 0.2)",
                  gutterBackground: "transparent",
                  gutterColor: "hsl(240 3.8% 46.1%)",
                  highlightBackground: "hsl(240 3.7% 15.9%)",
                  highlightGutterBackground: "hsl(240 3.7% 15.9%)",
                },
              },
              contentText: {
                fontSize: "14px",
                lineHeight: "1.6",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
