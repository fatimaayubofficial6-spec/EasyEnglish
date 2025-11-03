"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell, MainContent } from "@/components/layout";
import {
  SuccessCelebration,
  TranslationDiff,
  GrammarMistakes,
  TensesBadges,
  KeyVocabulary,
  FeedbackSummary,
  FeedbackActions,
  FeedbackLoading,
  FeedbackError,
} from "@/components/feedback";
import { PdfSavedBanner } from "@/components/feedback/PdfSavedBanner";
import { m, LazyMotion, domAnimation } from "framer-motion";

interface AttemptData {
  id: string;
  userId: string;
  paragraphId: string;
  exerciseType: string;
  userAnswer: string;
  correctAnswer?: string;
  score: number;
  feedback?: string;
  aiAnalysis?: {
    strengths?: string[];
    improvements?: string[];
    suggestions?: string[];
    correctedVersion?: string;
    grammarMistakes?: Array<{
      mistake: string;
      correction: string;
      explanation: string;
    }>;
    tenses?: string[];
    keyVocabulary?: Array<{
      word: string;
      definition: string;
      example: string;
    }>;
  };
  timeSpentSeconds?: number;
  completedAt: Date;
  createdAt: Date;
}

interface ParagraphData {
  id: string;
  title: string;
  content: string;
  difficulty: string;
  language: string;
  topics: string[];
}

interface FeedbackResponse {
  success: boolean;
  attempt: AttemptData;
  paragraph: ParagraphData;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FeedbackPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;

  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdfBanner, setShowPdfBanner] = useState(true);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/exercises/attempts/${attemptId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load feedback");
      }

      const result: FeedbackResponse = await response.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError(err instanceof Error ? err.message : "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attemptId) {
      fetchFeedback();
    }
  }, [attemptId]);

  if (loading) {
    return (
      <AppShell>
        <MainContent id="main-content">
          <FeedbackLoading />
        </MainContent>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell>
        <MainContent id="main-content">
          <FeedbackError
            error={error || "Attempt not found"}
            onRetry={fetchFeedback}
          />
        </MainContent>
      </AppShell>
    );
  }

  const { attempt, paragraph } = data;
  const aiAnalysis = attempt.aiAnalysis || {};

  return (
    <AppShell>
      <MainContent id="main-content">
        <LazyMotion features={domAnimation}>
          <m.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-16"
          >
            {/* Success Celebration with Confetti */}
            <m.div variants={fadeInUp}>
              <SuccessCelebration score={attempt.score} />
            </m.div>

            {/* Exercise Info */}
            <m.div variants={fadeInUp} className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{paragraph.title}</h1>
              <p className="text-muted-foreground">
                {paragraph.difficulty.charAt(0).toUpperCase() + paragraph.difficulty.slice(1)} •{" "}
                {paragraph.topics.join(", ")}
              </p>
            </m.div>

            {/* Translation Diff */}
            <m.div variants={fadeInUp}>
              <TranslationDiff
                userAnswer={attempt.userAnswer}
                correctedVersion={aiAnalysis.correctedVersion}
              />
            </m.div>

            {/* Grammar Mistakes */}
            <m.div variants={fadeInUp}>
              <GrammarMistakes mistakes={aiAnalysis.grammarMistakes} />
            </m.div>

            {/* Tenses */}
            {aiAnalysis.tenses && aiAnalysis.tenses.length > 0 && (
              <m.div variants={fadeInUp}>
                <TensesBadges tenses={aiAnalysis.tenses} />
              </m.div>
            )}

            {/* Key Vocabulary */}
            {aiAnalysis.keyVocabulary && aiAnalysis.keyVocabulary.length > 0 && (
              <m.div variants={fadeInUp}>
                <KeyVocabulary vocabulary={aiAnalysis.keyVocabulary} />
              </m.div>
            )}

            {/* Feedback Summary */}
            <m.div variants={fadeInUp}>
              <FeedbackSummary
                strengths={aiAnalysis.strengths}
                improvements={aiAnalysis.improvements}
                suggestions={aiAnalysis.suggestions}
                overallFeedback={attempt.feedback}
              />
            </m.div>

            {/* Actions */}
            <m.div variants={fadeInUp}>
              <FeedbackActions paragraphId={paragraph.id} pdfReady={true} />
            </m.div>
          </m.div>
        </LazyMotion>

        {/* PDF Saved Banner */}
        <PdfSavedBanner show={showPdfBanner} onDismiss={() => setShowPdfBanner(false)} />
      </MainContent>
    </AppShell>
  );
}
