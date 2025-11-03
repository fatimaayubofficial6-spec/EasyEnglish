"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Download, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FeedbackActionsProps {
  paragraphId: string;
  pdfReady?: boolean;
}

export function FeedbackActions({ paragraphId, pdfReady = false }: FeedbackActionsProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handlePdfDownload = async () => {
    setIsPdfLoading(true);
    // Simulate PDF loading (in real implementation, this would download the PDF)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsPdfLoading(false);
    // Navigate to PDF library
    window.location.href = "/my-pdf";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Primary CTA - Next Exercise */}
      <Link href="/dashboard" className="w-full sm:w-auto">
        <Button size="lg" className="w-full group">
          Next Exercise
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>

      {/* Secondary CTA - Download PDF */}
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handlePdfDownload}
        disabled={!pdfReady || isPdfLoading}
      >
        <Download className="mr-2 h-4 w-4" />
        {isPdfLoading ? "Loading..." : pdfReady ? "Download PDF" : "PDF Processing..."}
      </Button>

      {/* Tertiary CTA - Review Again */}
      <Link href={`/exercise/${paragraphId}`} className="w-full sm:w-auto">
        <Button size="lg" variant="ghost" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Review Again
        </Button>
      </Link>
    </div>
  );
}
