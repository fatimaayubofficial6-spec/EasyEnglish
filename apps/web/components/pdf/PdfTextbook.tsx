"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileText, BookOpen, Calendar, Share2, AlertCircle } from "lucide-react";

interface PdfTextbookProps {
  pdfUrl?: string;
  lessonsCount: number;
  lastUpdated?: Date;
}

export function PdfTextbook({ pdfUrl, lessonsCount, lastUpdated }: PdfTextbookProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPdf = !!pdfUrl && lessonsCount > 0;

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch("/api/pdf/download");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate download URL");
      }

      const data = await response.json();

      // Open signed URL in new tab to trigger download
      window.open(data.url, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // Format last updated date
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessonsCount}</div>
            <p className="text-xs text-muted-foreground">
              {lessonsCount === 0
                ? "Complete exercises to add lessons"
                : `${lessonsCount} lesson${lessonsCount === 1 ? "" : "s"} in your textbook`}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedDate || "—"}</div>
            <p className="text-xs text-muted-foreground">
              {formattedDate ? "PDF automatically updated" : "No lessons yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasPdf ? (
                <span className="text-green-500">Ready</span>
              ) : (
                <span className="text-muted-foreground">Pending</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasPdf ? "Available for download" : "Complete exercises to generate PDF"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Card */}
      {hasPdf ? (
        <Card className="glass">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Your Learning Textbook</CardTitle>
                <CardDescription className="mt-2">
                  Download your personalized PDF textbook with all your completed lessons and
                  feedback
                </CardDescription>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-3">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview Section */}
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">What&apos;s Inside</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>All your completed exercises with original text and translations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Detailed grammar corrections with explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Key vocabulary with definitions and examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Performance scores and personalized feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Grammar tenses used in each lesson</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                {isDownloading ? "Generating Link..." : "Download PDF"}
              </Button>
              <Button variant="outline" size="lg" disabled>
                <Share2 className="mr-2 h-5 w-5" />
                Share (Coming Soon)
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center">
              Download link expires after 1 hour. Your PDF is automatically updated after each
              completed exercise.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Get Started with Your Textbook</CardTitle>
                <CardDescription className="mt-2">
                  Complete your first exercise to generate your personalized learning textbook
                </CardDescription>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Lessons Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your PDF textbook will be automatically generated when you complete exercises. Each
                lesson will include your translations, corrections, vocabulary, and feedback.
              </p>
              <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500">
                <a href="/dashboard">Start Learning</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
